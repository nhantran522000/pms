import { Injectable, Logger } from '@nestjs/common';
import { AiGatewayService } from '@pms/shared-kernel';
import { TaskService } from './task.service';
import {
  CreateTaskFromNLDto,
  ParsedTask,
  TaskParsingResponse,
  TaskParsingPreviewResponse,
  ExtractResult,
} from '@pms/shared-types';

/**
 * TaskParsingService
 * Parses natural language input to extract task properties using AI Gateway
 * with fallback to regex patterns for common date expressions
 */
@Injectable()
export class TaskParsingService {
  private readonly logger = new Logger(TaskParsingService.name);

  // Regex patterns for date extraction
  private readonly hashtagRegex = /#(\w+)/g;
  private readonly tomorrowRegex = /\btomorrow\b/i;
  private readonly nextDayRegex = /\bnext\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;
  private readonly inDaysRegex = /\bin\s+(\d+)\s+(days?|hours?)\b/i;
  private readonly timeRegex = /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i;
  private readonly onTheNthRegex = /\bon\s+the\s+(\d{1,2})(?:st|nd|rd|th)?\b/i;
  private readonly priorityKeywords: Record<string, number> = {
    'urgent': 4,
    'asap': 4,
    'important': 3,
    'high priority': 3,
    'low priority': 1,
    'whenever': 1,
    'someday': 1,
  };

  constructor(
    private readonly aiGateway: AiGatewayService,
    private readonly taskService: TaskService,
  ) {}

  /**
   * Parse natural language input and create a task
   */
  async parseAndCreate(dto: CreateTaskFromNLDto): Promise<TaskParsingResponse> {
    const parsed = await this.parseInput(dto.input, dto.timezone);

    const task = await this.taskService.create({
      title: parsed.title,
      description: parsed.description,
      dueDate: parsed.dueDate ? parsed.dueDate.toISOString() : undefined,
      priority: parsed.priority ?? 2,
      tags: parsed.tags,
    });

    this.logger.log(`Task created from NL: "${dto.input}" -> "${parsed.title}"`);

    return {
      original: dto.input,
      parsed,
      task: task.toJSON(),
    };
  }

  /**
   * Preview parsed result without creating a task
   */
  async preview(dto: CreateTaskFromNLDto): Promise<TaskParsingPreviewResponse> {
    const parsed = await this.parseInput(dto.input, dto.timezone);

    return {
      original: dto.input,
      parsed,
    };
  }

  /**
   * Parse input using AI Gateway with fallback to regex patterns
   */
  private async parseInput(input: string, timezone?: string): Promise<ParsedTask> {
    // Step 1: Extract hashtags with regex (reliable)
    const tags = this.extractHashtags(input);

    // Step 2: Detect priority keywords
    const priority = this.detectPriority(input);

    // Step 3: Remove extracted elements to get clean input for AI
    const cleanInput = this.removeExtractedElements(input, tags);

    // Step 4: Try AI extraction for title and date
    let title: string;
    let dueDate: Date | null = null;
    let confidence = 0.5;

    try {
      const aiResult = await this.extractWithAI(cleanInput);

      if (aiResult) {
        title = aiResult.title;
        dueDate = aiResult.dueDate;
        confidence = Math.max(confidence, aiResult.confidence);
      } else {
        // Fallback: use clean input as title, try regex date parsing
        title = cleanInput.trim();
        dueDate = this.parseDateWithRegex(input, timezone);
        confidence = 0.6; // Lower confidence for regex-only parsing
      }
    } catch (error) {
      this.logger.warn(`AI extraction failed, using fallback: ${error}`);
      // Fallback: use clean input as title, try regex date parsing
      title = cleanInput.trim();
      dueDate = this.parseDateWithRegex(input, timezone);
      confidence = 0.5;
    }

    // Ensure title is not empty
    if (!title || title.trim().length === 0) {
      title = input.replace(/#\w+/g, '').trim();
    }

    return {
      title,
      dueDate,
      priority,
      tags,
      confidence,
    };
  }

  /**
   * Extract hashtags from input
   */
  private extractHashtags(input: string): string[] {
    const matches = input.match(this.hashtagRegex);
    return matches ? matches.map((tag) => tag.slice(1).toLowerCase()) : [];
  }

  /**
   * Detect priority from keywords in input
   */
  private detectPriority(input: string): number | undefined {
    const lowerInput = input.toLowerCase();

    for (const [keyword, priority] of Object.entries(this.priorityKeywords)) {
      if (lowerInput.includes(keyword)) {
        return priority;
      }
    }

    return undefined;
  }

  /**
   * Remove extracted elements (hashtags, priority keywords) from input
   */
  private removeExtractedElements(input: string, tags: string[]): string {
    let result = input;

    // Remove hashtags
    result = result.replace(this.hashtagRegex, '');

    // Remove priority keywords
    for (const keyword of Object.keys(this.priorityKeywords)) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      result = result.replace(regex, '');
    }

    // Clean up extra whitespace
    result = result.replace(/\s+/g, ' ').trim();

    return result;
  }

  /**
   * Use AI Gateway to extract title and date
   */
  private async extractWithAI(
    cleanInput: string,
  ): Promise<{ title: string; dueDate: Date | null; confidence: number } | null> {
    const prompt = `Extract task details from this natural language input. Return a JSON object with:
- title: The task title (clean, concise)
- dueDate: The due date in ISO format if mentioned, or null
- confidence: A number between 0 and 1 indicating parsing confidence

Input: "${cleanInput}"

Return ONLY valid JSON, no markdown or explanation.`;

    const response = await this.aiGateway.execute({
      taskType: 'EXTRACT',
      prompt,
      context: {
        type: 'task_parsing',
      },
    });

    if (!response.success || !response.result) {
      this.logger.warn(`AI extraction failed: ${response.error}`);
      return null;
    }

    const extractResult = response.result as ExtractResult;
    const metadata = extractResult.metadata as Record<string, unknown> | undefined;

    // Try to parse from metadata if available
    if (metadata && typeof metadata === 'object') {
      const title = typeof metadata['title'] === 'string' ? metadata['title'] : cleanInput;
      const dueDateStr = metadata['dueDate'];
      const confidence = typeof metadata['confidence'] === 'number' ? metadata['confidence'] : 0.8;

      let dueDate: Date | null = null;
      if (typeof dueDateStr === 'string' && dueDateStr !== 'null') {
        dueDate = new Date(dueDateStr);
        if (isNaN(dueDate.getTime())) {
          dueDate = null;
        }
      }

      return { title, dueDate, confidence };
    }

    // Try to extract from entities
    const titleEntity = extractResult.entities.find((e) => e.type === 'title');
    const dateEntity = extractResult.entities.find((e) => e.type === 'date' || e.type === 'dueDate');

    const title = titleEntity?.value ?? cleanInput;
    let dueDate: Date | null = null;

    if (dateEntity) {
      dueDate = new Date(dateEntity.value);
      if (isNaN(dueDate.getTime())) {
        dueDate = null;
      }
    }

    const confidence = Math.max(
      titleEntity?.confidence ?? 0.5,
      dateEntity?.confidence ?? 0.5,
    );

    return { title, dueDate, confidence };
  }

  /**
   * Parse date using regex patterns (fallback)
   */
  private parseDateWithRegex(input: string, timezone?: string): Date | null {
    const now = new Date();
    const lowerInput = input.toLowerCase();

    // Try "tomorrow"
    if (this.tomorrowRegex.test(lowerInput)) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      // Check for time
      const timeMatch = lowerInput.match(this.timeRegex);
      if (timeMatch) {
        this.applyTimeMatch(tomorrow, timeMatch);
      }

      return tomorrow;
    }

    // Try "next monday/tuesday/etc"
    const nextDayMatch = lowerInput.match(this.nextDayRegex);
    if (nextDayMatch) {
      return this.getNextDayOfWeek(nextDayMatch[1]);
    }

    // Try "in N days/hours"
    const inDaysMatch = lowerInput.match(this.inDaysRegex);
    if (inDaysMatch) {
      const amount = parseInt(inDaysMatch[1], 10);
      const unit = inDaysMatch[2].toLowerCase();

      const result = new Date(now);
      if (unit.startsWith('day')) {
        result.setDate(result.getDate() + amount);
      } else if (unit.startsWith('hour')) {
        result.setHours(result.getHours() + amount);
      }

      return result;
    }

    // Try "on the Nth"
    const onTheNthMatch = lowerInput.match(this.onTheNthRegex);
    if (onTheNthMatch) {
      const dayOfMonth = parseInt(onTheNthMatch[1], 10);
      const result = new Date(now);

      // If the day has passed this month, use next month
      if (dayOfMonth <= now.getDate()) {
        result.setMonth(result.getMonth() + 1);
      }
      result.setDate(dayOfMonth);
      result.setHours(0, 0, 0, 0);

      return result;
    }

    return null;
  }

  /**
   * Get next occurrence of a day of week
   */
  private getNextDayOfWeek(dayName: string): Date {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDay = days.indexOf(dayName.toLowerCase());
    const now = new Date();
    const currentDay = now.getDay();

    let daysUntil = targetDay - currentDay;
    if (daysUntil <= 0) {
      daysUntil += 7;
    }

    const result = new Date(now);
    result.setDate(result.getDate() + daysUntil);
    result.setHours(0, 0, 0, 0);

    return result;
  }

  /**
   * Apply time match to a date
   */
  private applyTimeMatch(date: Date, match: RegExpMatchArray): void {
    let hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const ampm = match[3]?.toLowerCase();

    if (ampm === 'pm' && hours < 12) {
      hours += 12;
    } else if (ampm === 'am' && hours === 12) {
      hours = 0;
    }

    date.setHours(hours, minutes, 0, 0);
  }
}
