import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isDev = config.get('app.nodeEnv') !== 'production';

        return {
          pinoHttp: {
            name: 'pms-api',
            level: config.get('app.logging.level') || 'info',
            transport: isDev
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                  },
                }
              : undefined,
            genReqId: (req) => (req as any).correlationId,
            serializers: {
              req: (req) => ({
                id: req.id,
                method: req.method,
                url: req.url,
                query: req.query,
                headers: {
                  'user-agent': req.headers['user-agent'],
                  'content-type': req.headers['content-type'],
                },
              }),
              res: (res) => ({
                statusCode: res.statusCode,
              }),
            },
            customProps: () => ({
              context: 'http',
            }),
          },
        };
      },
    }),
  ],
  exports: [LoggerModule],
})
export class LoggingModule {}
