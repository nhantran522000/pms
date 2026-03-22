import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { BaseAiProvider } from './base.provider';
import { AiProviderConfig } from '../types';
import { AiRequest, AiResponse, AiTaskType } from '@pms/shared-types';

// Task type to model mapping for Groq
const GROQ_TASK_MODELS: Record<AiTaskType, string> = {
  CLASSIFY: 'gemma2-9b-it',
  LABEL: 'gemma2-9b-it',
  SUMMARIZE: 'llama-3.3-70b-versatile',
  ANALYZE: 'llama-3.3-70b-versatile',
  EXTRACT: 'gemma2-9b-it',
  CHAT: 'llama-3.3-70b-versatile',
};

const SUPPORTED_TASK_TYPES: AiTaskType[] = [
  'CLASSIFY',
  'LABEL',
  'SUMMARIZE',
  'ANALYZE',
  'EXTRACT',
  'CHAT',
];

/**
 * Groq AI provider implementation
 * Uses Groq's fast inference API with Llama and Gemma models
 */
@Injectable()
export class GroqProvider extends BaseAiProvider {
  private readonly groq: Groq;

  constructor(private readonly configService: ConfigService) {
    const apiKey = configService.get<string>('GROQ_API_KEY') || '';
    const config: AiProviderConfig = {
      apiKey,
      baseUrl: 'https://api.groq.com/openai/v1',
      timeout: 30000,
    };
    super('groq', config, 'llama-3.3-70b-versatile');

    this.groq = new Groq({
      apiKey: config.apiKey,
      timeout: config.timeout,
    });
  }

  get supportedTaskTypes(): AiTaskType[] {
    return SUPPORTED_TASK_TYPES;
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Quick check: API key exists
      if (!this.config.apiKey) {
        return false;
      }
      // Could add a lightweight models list call here
      return true;
    } catch {
      return false;
    }
  }

  async execute(request: AiRequest): Promise<AiResponse> {
    const startTime = Date.now();
    const model = GROQ_TASK_MODELS[request.taskType] || this.defaultModel;

    try {
      const response = await this.groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'user',
            content: request.prompt,
          },
        ],
        max_tokens: request.maxTokens || 1024,
        temperature: request.temperature ?? 0.7,
      });

      const latencyMs = Date.now() - startTime;
      const choice = response.choices[0];

      return {
        success: true,
        content: choice?.message?.content || '',
        provider: 'groq',
        model,
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0,
        latencyMs,
      };
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      return this.createErrorResponse(error, latencyMs);
    }
  }
}
