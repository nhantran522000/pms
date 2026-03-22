import { AiRequest, AiResponse, AiProvider, AiTaskType } from '@pms/shared-types';

/**
 * Interface for AI provider implementations
 */
export interface AiProviderInterface {
  readonly name: AiProvider;
  readonly defaultModel: string;
  readonly supportedTaskTypes: AiTaskType[];

  isAvailable(): Promise<boolean>;
  execute(request: AiRequest): Promise<AiResponse>;
}

/**
 * Configuration for AI providers
 */
export interface AiProviderConfig {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
  timeout?: number;
}

/**
 * Circuit breaker state for provider health tracking
 */
export interface CircuitBreakerState {
  provider: AiProvider;
  isBlocked: boolean;
  blockedUntil?: Date;
  failureCount: number;
  lastFailure?: Date;
}
