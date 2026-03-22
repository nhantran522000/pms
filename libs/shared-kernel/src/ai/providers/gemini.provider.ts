import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseAiProvider } from './base.provider';
import { AiProviderConfig } from '../types';
import { AiRequest, AiResponse, AiTaskType } from '@pms/shared-types';

// Gemini 2.0 Flash for all task types (fast, capable)
const GEMINI_MODEL = 'gemini-2.0-flash';

const SUPPORTED_TASK_TYPES: AiTaskType[] = [
  'CLASSIFY',
  'LABEL',
  'SUMMARIZE',
  'ANALYZE',
  'EXTRACT',
  'CHAT',
];

/**
 * Gemini AI provider implementation
 * Uses Google's Gemini 2.0 Flash model for fast, capable inference
 */
@Injectable()
export class GeminiProvider extends BaseAiProvider {
  private readonly genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = configService.get<string>('GOOGLE_AI_API_KEY') || '';
    const config: AiProviderConfig = {
      apiKey,
      timeout: 30000,
    };
    super('gemini', config, GEMINI_MODEL);

    this.genAI = new GoogleGenerativeAI(config.apiKey);
  }

  get supportedTaskTypes(): AiTaskType[] {
    return SUPPORTED_TASK_TYPES;
  }

  async isAvailable(): Promise<boolean> {
    try {
      return !!this.config.apiKey;
    } catch {
      return false;
    }
  }

  async execute(request: AiRequest): Promise<AiResponse> {
    const startTime = Date.now();
    const model = this.genAI.getGenerativeModel({ model: this.defaultModel });

    try {
      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: request.prompt }],
          },
        ],
        generationConfig: {
          maxOutputTokens: request.maxTokens || 1024,
          temperature: request.temperature ?? 0.7,
        },
      });

      const latencyMs = Date.now() - startTime;
      const response = result.response;
      const text = response.text();
      const usage = response.usageMetadata;

      return {
        success: true,
        content: text,
        provider: 'gemini',
        model: this.defaultModel,
        inputTokens: usage?.promptTokenCount || 0,
        outputTokens: usage?.candidatesTokenCount || 0,
        latencyMs,
      };
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      return this.createErrorResponse(error, latencyMs);
    }
  }
}
