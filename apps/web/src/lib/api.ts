/**
 * Base API client with fetch wrapper
 *
 * Per CONTEXT.md:
 * - Base URL: /api/v1/ (relative path for same-origin)
 * - Error format: { success: false, error: { code, message, details } }
 * - Cookie handling: credentials: 'include' for httpOnly auth cookies
 */

const API_BASE_URL = '/api/v1';

interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

interface ErrorResponse {
  success: false;
  error: ApiError;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

    try {
      const errorData: ErrorResponse = await response.json();
      errorMessage = errorData.error.message || errorMessage;
    } catch {
      // If parsing fails, use default error message
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export async function get<T>(url: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  return handleResponse<T>(response);
}

export async function post<T>(url: string, data: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  return handleResponse<T>(response);
}

export async function put<T>(url: string, data: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  return handleResponse<T>(response);
}

export async function del<T>(url: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  return handleResponse<T>(response);
}
