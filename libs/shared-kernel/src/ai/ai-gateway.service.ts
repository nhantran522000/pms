import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GroqProvider } from './providers/groq.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { AiProviderInterface } from './types';
import { AiRequest, AiResponse, AiProvider } from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

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
  async execute(request: AiRequest): Promise<AiResponse> {
    const tenantId = getTenantId();
    this.logger.debug(`AI request from tenant ${tenantId}: ${request.taskType}`);

    // Try providers in priority order
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
      const response = await provider.execute(request);

      if (response.success) {
        this.logger.log(
          `AI request completed: provider=${providerName}, model=${response.model}, tokens=${response.inputTokens + response.outputTokens}, latency=${response.latencyMs}ms`
        );
        return response;
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
}
