import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GroqProvider } from './providers/groq.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { AiProviderInterface } from './types';
import { UsageLoggingService } from './usage-logging.service';
import { AiRequest, AiResponse, AiProvider, AiResponseWithResult, TaskResult } from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';
import { PromptCacheService } from './prompt-cache.service';
import { TokenBudgetService } from './token-budget.service';
import { CircuitBreakerService } from './circuit-breaker.service';
import { CircuitBreakerState } from './types';
import {
  enhancePrompt,
  parseResponse,
  getModelParams,
} from './task-type-matrix';

/**
 * AI Gateway Service
 * Unified entry point for all AI operations with automatic provider selection and fallback
 */
@Injectable()
export class AiGatewayService {
  private readonly logger = new Logger(AiGatewayService.name);
  private readonly providers: Map<AiProvider, AiProviderInterface>;
  private readonly providerPriority: AiProvider[] = ['groq', 'gemini'];

  constructor(
    private readonly groqProvider: GroqProvider,
    private readonly geminiProvider: GeminiProvider,
    private readonly configService: ConfigService,
    private readonly promptCache: PromptCacheService,
    private readonly tokenBudget: TokenBudgetService,
    private readonly usageLogging: UsageLoggingService,
    private readonly circuitBreaker: CircuitBreakerService,
  ) {
    this.providers = new Map([
      ['groq', groqProvider],
      ['gemini', geminiProvider],
    ]);
  }

  /**
   * Execute AI request with automatic provider selection and fallback
   * Tries providers in priority order (groq -> gemini) until one succeeds
   */
  async execute(request: AiRequest): Promise<AiResponseWithResult> {
    const tenantId = getTenantId();
    this.logger.debug(`AI request from tenant ${tenantId}: ${request.taskType}`);

    // STEP 1: Check cache first
    const cachedResponse = await this.promptCache.get(request.prompt, request.taskType);
    if (cachedResponse) {
      this.logger.log(`Cache hit for ${request.taskType}`);
      return cachedResponse as AiResponseWithResult;
    }

    // STEP 2: Check token budget
    const modelParams = getModelParams(request);
    const hasBudget = await this.tokenBudget.hasBudget(modelParams.maxTokens);
    if (!hasBudget) {
      const usage = await this.tokenBudget.getCurrentUsage();
      this.logger.error(`Tenant ${tenantId} over budget: ${usage.percentUsed}%`);
      return {
        success: false,
        content: '',
        provider: 'groq',
        model: 'unknown',
        inputTokens: 0,
        outputTokens: 0,
        latencyMs: 0,
        error: `Token budget exceeded. Used ${usage.used} of ${usage.quota} tokens.`,
      };
    }

    // STEP 3: Enhance prompt with task-specific formatting
    const enhancedPrompt = enhancePrompt(request);

    // Create enhanced request for providers
    const enhancedRequest: AiRequest = {
      ...request,
      prompt: enhancedPrompt,
      maxTokens: modelParams.maxTokens,
      temperature: modelParams.temperature,
    };

    // STEP 4: Try providers in priority order
    for (const providerName of this.providerPriority) {
      const provider = this.providers.get(providerName);

      if (!provider) {
        this.logger.warn(`Provider ${providerName} not available`);
        continue;
      }

      // Check if provider supports this task type
      if (!provider.supportedTaskTypes.includes(request.taskType)) {
        this.logger.debug(`Provider ${providerName} does not support ${request.taskType}`);
        continue;
      }

      // Check if provider is available
      const isAvailable = await provider.isAvailable();
      if (!isAvailable) {
        this.logger.warn(`Provider ${providerName} is not available`);
        continue;
      }

      // Execute request
      const response = await provider.execute(enhancedRequest);

      if (response.success) {
        // Parse response into typed result
        const result = parseResponse(request.taskType, response.content);

        // Create enhanced response with result
        const enhancedResponse: AiResponseWithResult = {
          ...response,
          result,
        };

        // Cache successful response
        await this.promptCache.set(request.prompt, request.taskType, enhancedResponse);

        // Log usage
        await this.logUsage(request, enhancedResponse);

        // Check budget alert
        await this.tokenBudget.checkAndAlert();

        this.logger.log(
          `AI request completed: provider=${providerName}, task=${request.taskType}, tokens=${enhancedResponse.inputTokens + enhancedResponse.outputTokens}`
        );
        return enhancedResponse;
      }

      // Log failure and try next provider
      this.logger.warn(
        `Provider ${providerName} failed: ${response.error}. Trying next provider...`
      );
    }

    // All providers failed
    this.logger.error('All AI providers failed');
    return {
      success: false,
      content: '',
      provider: 'groq',
      model: 'unknown',
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: 0,
      error: 'All AI providers failed',
    };
  }

  /**
   * Execute with a specific provider (for testing or specific needs)
   */
  async executeWithProvider(providerName: AiProvider, request: AiRequest): Promise<AiResponse> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }
    return provider.execute(request);
  }

  /**
   * Get available providers
   */
  async getAvailableProviders(): Promise<AiProvider[]> {
    const available: AiProvider[] = [];

    for (const providerName of this.providerPriority) {
      const provider = this.providers.get(providerName);
      if (provider && await provider.isAvailable()) {
        available.push(providerName);
      }
    }

    return available;
  }

  /**
   * Log AI usage to database
   */
  private async logUsage(request: AiRequest, response: AiResponse): Promise<void> {
    try {
      await this.usageLogging.log({
        provider: response.provider,
        model: response.model,
        taskType: request.taskType,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        latencyMs: response.latencyMs,
        success: response.success,
        errorMessage: response.error,
      });
    } catch (error) {
      this.logger.error(`Failed to log usage: ${error}`);
    }
  }
}
