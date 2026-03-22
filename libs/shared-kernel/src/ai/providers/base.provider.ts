import { Logger } from '@nestjs/common';
import { AiProviderInterface, AiProviderConfig } from '../types';
import { AiProvider } from '@pms/shared-types';

/**
 * Abstract base class for AI providers
 * Provides common error handling and response creation
 */
export abstract class BaseAiProvider implements AiProviderInterface {
  protected readonly logger: Logger;
  protected readonly config: AiProviderConfig;

  constructor(
    public readonly name: AiProvider,
    config: AiProviderConfig,
    public readonly defaultModel: string,
  ) {
    this.config = config;
    this.logger = new Logger(`${name.toUpperCase()}Provider`);
  }

  /**
   * Check if provider is available (API key configured, service reachable)
   */
  abstract isAvailable(): Promise<boolean>;

  /**
   * Execute AI request
   */
  abstract execute(request: import('@pms/shared-types').AiRequest): Promise<import('@pms/shared-types').AiResponse>;

  /**
   * Create standardized error response
   */
  protected createErrorResponse(error: unknown, latencyMs: number): import('@pms/shared-types').AiResponse {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    this.logger.error(`AI request failed: ${errorMessage}`);
    return {
      success: false,
      content: '',
      provider: this.name,
      model: this.defaultModel,
      inputTokens: 0,
      outputTokens: 0,
      latencyMs,
      error: errorMessage,
    };
  }
}
