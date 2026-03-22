import { Logger } from '@nestjs/common';
import {
  AiTaskType,
  AiRequest,
  ClassifyResult,
  LabelResult,
  SummarizeResult,
  AnalyzeResult,
  ExtractResult,
  ChatResult,
  TaskResult,
  ClassifyResultSchema,
  LabelResultSchema,
  SummarizeResultSchema,
  AnalyzeResultSchema,
  ExtractResultSchema,
  ChatResultSchema,
} from '@pms/shared-types';

export interface TaskConfig {
  systemPrompt: string;
  responseFormat: string;
  defaultMaxTokens: number;
  defaultTemperature: number;
  requiresJsonResponse: boolean;
}

/**
 * Task type configuration matrix
 * Defines prompts, formats, and defaults for each task type
 */
export const TASK_CONFIGS: Record<AiTaskType, TaskConfig> = {
  CLASSIFY: {
    systemPrompt: `You are a classification assistant. Analyze the input and categorize it.
Respond with a JSON object containing:
- "category": the best matching category (string)
- "confidence": your confidence level 0-1 (number)
- "alternatives": optional array of {category, confidence} for other likely categories

Be precise and consistent with category names. Use the provided categories if given.`,
    responseFormat: 'json',
    defaultMaxTokens: 500,
    defaultTemperature: 0.3, // Low temperature for consistency
    requiresJsonResponse: true,
  },

  LABEL: {
    systemPrompt: `You are a labeling assistant. Analyze the input and assign relevant labels.
Respond with a JSON object containing:
- "labels": array of applicable labels (strings)
- "confidence": object mapping each label to confidence 0-1

Be comprehensive but only include labels with confidence > 0.5.`,
    responseFormat: 'json',
    defaultMaxTokens: 500,
    defaultTemperature: 0.4,
    requiresJsonResponse: true,
  },

  SUMMARIZE: {
    systemPrompt: `You are a summarization assistant. Create a clear, concise summary of the input.
Respond with a JSON object containing:
- "summary": the summary text (string)
- "keyPoints": optional array of main points (strings)
- "wordCount": number of words in summary

Capture essential information while being concise. Aim for 10-20% of original length unless specified otherwise.`,
    responseFormat: 'json',
    defaultMaxTokens: 1000,
    defaultTemperature: 0.5,
    requiresJsonResponse: true,
  },

  ANALYZE: {
    systemPrompt: `You are an analysis assistant. Provide deep analysis and insights.
Respond with a JSON object containing:
- "insights": array of key insights (strings)
- "sentiment": optional "positive", "negative", or "neutral"
- "themes": optional array of identified themes (strings)
- "recommendations": optional array of actionable recommendations (strings)

Be thorough and provide actionable insights.`,
    responseFormat: 'json',
    defaultMaxTokens: 2000,
    defaultTemperature: 0.6,
    requiresJsonResponse: true,
  },

  EXTRACT: {
    systemPrompt: `You are an extraction assistant. Extract structured data from the input.
Respond with a JSON object containing:
- "entities": array of {type, value, confidence}
  - "type": the entity type (e.g., "date", "amount", "name", "email")
  - "value": the extracted value (string)
  - "confidence": extraction confidence 0-1 (number)
- "metadata": optional additional structured data

Extract all relevant entities with high accuracy.`,
    responseFormat: 'json',
    defaultMaxTokens: 1000,
    defaultTemperature: 0.3,
    requiresJsonResponse: true,
  },

  CHAT: {
    systemPrompt: `You are a helpful assistant. Engage in natural conversation.
Respond with a JSON object containing:
- "response": your conversational response (string)
- "followUpQuestions": optional array of relevant follow-up questions
- "contextUsed": boolean indicating if you used provided context

Be helpful, accurate, and engaging. Use provided context when relevant.`,
    responseFormat: 'json',
    defaultMaxTokens: 1500,
    defaultTemperature: 0.7, // Higher for more natural conversation
    requiresJsonResponse: true,
  },
};

/**
 * Get system prompt for a task type
 */
export function getSystemPrompt(taskType: AiTaskType): string {
  return TASK_CONFIGS[taskType]?.systemPrompt || '';
}

/**
 * Get task configuration
 */
export function getTaskConfig(taskType: AiTaskType): TaskConfig {
  return TASK_CONFIGS[taskType] || TASK_CONFIGS.CHAT;
}

/**
 * Enhance a user prompt with task-specific formatting
 */
export function enhancePrompt(request: AiRequest): string {
  const config = getTaskConfig(request.taskType);

  // Combine system instruction with user prompt
  let enhancedPrompt = `${config.systemPrompt}\n\n---\n\nUser input:\n${request.prompt}`;

  // Add context if provided
  if (request.context && Object.keys(request.context).length > 0) {
    enhancedPrompt += `\n\nAdditional context:\n${JSON.stringify(request.context, null, 2)}`;
  }

  // Add JSON format reminder
  if (config.requiresJsonResponse) {
    enhancedPrompt += '\n\nRespond only with valid JSON. No markdown, no explanation.';
  }

  return enhancedPrompt;
}

/**
 * Parse raw AI response into typed result
 */
export function parseResponse(taskType: AiTaskType, content: string): TaskResult | null {
  const logger = new Logger('TaskTypeMatrix');

  try {
    // Try to extract JSON from response (handle markdown code blocks)
    let jsonStr = content;

    // Remove markdown code blocks if present
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    // Parse JSON
    const parsed = JSON.parse(jsonStr);

    // Validate and return based on task type
    switch (taskType) {
      case 'CLASSIFY':
        return ClassifyResultSchema.parse(parsed) as ClassifyResult;
      case 'LABEL':
        return LabelResultSchema.parse(parsed) as LabelResult;
      case 'SUMMARIZE':
        return SummarizeResultSchema.parse(parsed) as SummarizeResult;
      case 'ANALYZE':
        return AnalyzeResultSchema.parse(parsed) as AnalyzeResult;
      case 'EXTRACT':
        return ExtractResultSchema.parse(parsed) as ExtractResult;
      case 'CHAT':
        return ChatResultSchema.parse(parsed) as ChatResult;
      default:
        logger.warn(`Unknown task type: ${taskType}`);
        return null;
    }
  } catch (error) {
    logger.error(`Failed to parse ${taskType} response: ${error}`);
    // Return a fallback result with raw content
    return createFallbackResult(taskType, content);
  }
}

/**
 * Create a fallback result when parsing fails
 */
function createFallbackResult(taskType: AiTaskType, rawContent: string): TaskResult {
  switch (taskType) {
    case 'CLASSIFY':
      return { category: 'unknown', confidence: 0 };
    case 'LABEL':
      return { labels: [], confidence: {} };
    case 'SUMMARIZE':
      return { summary: rawContent, wordCount: rawContent.split(/\s+/).length };
    case 'ANALYZE':
      return { insights: [rawContent] };
    case 'EXTRACT':
      return { entities: [] };
    case 'CHAT':
      return { response: rawContent, contextUsed: false };
    default:
      return { response: rawContent };
  }
}

/**
 * Get recommended model parameters for a task
 */
export function getModelParams(request: AiRequest): { maxTokens: number; temperature: number } {
  const config = getTaskConfig(request.taskType);
  return {
    maxTokens: request.maxTokens || config.defaultMaxTokens,
    temperature: request.temperature ?? config.defaultTemperature,
  };
}
