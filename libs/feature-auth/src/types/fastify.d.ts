import 'fastify';

declare module 'fastify' {
  interface FastifyReply {
    setCookie(
      name: string,
      value: string,
      options?: {
        domain?: string;
        expires?: Date;
        httpOnly?: boolean;
        maxAge?: number;
        path?: string;
        sameSite?: 'strict' | 'lax' | 'none';
        secure?: boolean;
        signed?: boolean;
      }
    ): FastifyReply;

    clearCookie(
      name: string,
      options?: {
        domain?: string;
        path?: string;
        sameSite?: 'strict' | 'lax' | 'none';
        secure?: boolean;
        httpOnly?: boolean;
      }
    ): FastifyReply;
  }
}
