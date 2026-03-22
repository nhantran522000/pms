import { z } from 'zod';

// Response DTOs
export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    emailVerified: boolean;
  };
}

export interface MessageResponse {
  message: string;
}

// JWT Payload
export interface JwtPayload {
  sub: string;
  email: string;
  tenantId: string;
  iat?: number;
  exp?: number;
}
