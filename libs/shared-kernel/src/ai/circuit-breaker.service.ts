import { Injectable, Logger } from '@nestjs/common';
import { AiProvider } from '@pms/shared-types';
import { CircuitBreakerState } from './types';

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private readonly providerStates: Map<AiProvider, CircuitBreakerState> = new Map();

  // Configuration
  private readonly RATE_LIMIT_BLOCK_DURATION_MS = 60_000; // 60 seconds for 429
  private readonly FAILURE_THRESHOLD = 3; // Consecutive failures before block

  constructor() {
    // Initialize states for all providers
    this.providerStates.set('groq', this.createInitialState('groq'));
    this.providerStates.set('gemini', this.createInitialState('gemini'));
  }

  private createInitialState(provider: AiProvider): CircuitBreakerState {
    return {
      provider,
      isBlocked: false,
      failureCount: 0,
    };
  }

  /**
   * Check if a provider is currently blocked
   */
  isBlocked(provider: AiProvider): boolean {
    const state = this.providerStates.get(provider);
    if (!state) return false;

    // Check if block has expired
    if (state.isBlocked && state.blockedUntil) {
      if (new Date() > state.blockedUntil) {
        this.logger.log(`Circuit breaker unblocked for ${provider}`);
        state.isBlocked = false;
        state.blockedUntil = undefined;
        state.failureCount = 0;
        return false;
      }
    }

    return state.isBlocked;
  }

  /**
   * Record a failure and potentially block the provider
   * @param provider - The provider that failed
   * @param error - The error message or status code
   * @returns true if provider should be immediately rotated
   */
  recordFailure(provider: AiProvider, error: string): boolean {
    const state = this.providerStates.get(provider);
    if (!state) return false;

    state.failureCount++;
    state.lastFailure = new Date();

    // Check for rate limit (429) - block for 60 seconds
    if (this.isRateLimitError(error)) {
      this.blockProvider(provider, this.RATE_LIMIT_BLOCK_DURATION_MS);
      this.logger.warn(`Rate limit detected for ${provider}. Blocked for 60 seconds.`);
      return true;
    }

    // Check for server error (5xx) - immediate rotation, no extended block
    if (this.isServerError(error)) {
      this.logger.warn(`Server error from ${provider}. Immediate rotation.`);
      // Don't block for extended time, just rotate
      return true;
    }

    // Threshold-based blocking for other errors
    if (state.failureCount >= this.FAILURE_THRESHOLD) {
      this.blockProvider(provider, this.RATE_LIMIT_BLOCK_DURATION_MS);
      this.logger.warn(
        `Provider ${provider} exceeded failure threshold (${state.failureCount} failures). Blocked for 60 seconds.`
      );
      return true;
    }

    return false;
  }

  /**
   * Record a successful response - reset failure count
   */
  recordSuccess(provider: AiProvider): void {
    const state = this.providerStates.get(provider);
    if (!state) return;

    if (state.failureCount > 0) {
      this.logger.debug(`Resetting failure count for ${provider} after successful response`);
    }

    state.failureCount = 0;
    state.isBlocked = false;
    state.blockedUntil = undefined;
  }

  /**
   * Get current state of all providers
   */
  getProviderStates(): Map<AiProvider, CircuitBreakerState> {
    return new Map(this.providerStates);
  }

  /**
   * Manually unblock a provider (for admin operations)
   */
  unblock(provider: AiProvider): void {
    const state = this.providerStates.get(provider);
    if (state) {
      state.isBlocked = false;
      state.blockedUntil = undefined;
      state.failureCount = 0;
      this.logger.log(`Manually unblocked ${provider}`);
    }
  }

  private blockProvider(provider: AiProvider, durationMs: number): void {
    const state = this.providerStates.get(provider);
    if (!state) return;

    state.isBlocked = true;
    state.blockedUntil = new Date(Date.now() + durationMs);
  }

  private isRateLimitError(error: string): boolean {
    const rateLimitPatterns = [
      '429',
      'rate limit',
      'rate_limit',
      'too many requests',
      'quota exceeded',
      'quota_exceeded',
    ];
    const lowerError = error.toLowerCase();
    return rateLimitPatterns.some(pattern => lowerError.includes(pattern));
  }

  private isServerError(error: string): boolean {
    // Match 5xx status codes
    const serverErrorPatterns = [
      '500',
      '502',
      '503',
      '504',
      'internal server error',
      'bad gateway',
      'service unavailable',
      'gateway timeout',
      'server error',
    ];
    const lowerError = error.toLowerCase();
    return serverErrorPatterns.some(pattern => lowerError.includes(pattern));
  }
}
