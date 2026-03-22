import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const configSchema = z.object({
  nodeEnv: z.string().default('development'),
  port: z.coerce.number().default(3000),
  database: z.object({
    url: z.string(),
  }),
  jwt: z.object({
    secret: z.string().min(32),
    expiresIn: z.string().default('7d'),
  }),
  email: z.object({
    resendApiKey: z.string().optional(),
    from: z.string().email().default('noreply@pms.local'),
  }),
  logging: z.object({
    level: z.enum(['trace', 'debug', 'info', 'warn', 'error']).default('info'),
  }),
});

export type Config = z.infer<typeof configSchema>;
export default registerAs('app', () => {
  const validatedConfig = configSchema.safeParse({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    database: {
      url: process.env.DATABASE_URL,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
    email: {
      resendApiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM,
    },
    logging: {
      level: process.env.LOG_LEVEL,
    },
  });

  if (!validatedConfig.success) {
    throw new Error(`Configuration validation failed: ${JSON.stringify(validatedConfig.error.errors, null, 2)}`);
  }

  return validatedConfig.data;
});
