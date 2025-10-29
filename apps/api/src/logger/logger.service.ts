import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor() {
    // Define log format
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    );

    // Console format (prettier for development)
    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, context, trace }) => {
        const contextStr = context ? `[${context}]` : '';
        const traceStr = trace ? `\n${trace}` : '';
        return `${timestamp} ${level} ${contextStr} ${message}${traceStr}`;
      })
    );

    // Create logs directory if it doesn't exist
    const logsDir = path.join(process.cwd(), 'logs');

    // Daily rotate file transport for all logs
    const dailyRotateTransport = new DailyRotateFile({
      filename: path.join(logsDir, 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d', // Keep logs for 14 days
      format: logFormat,
    });

    // Daily rotate file transport for errors only
    const errorRotateTransport = new DailyRotateFile({
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '30d', // Keep error logs for 30 days
      format: logFormat,
    });

    // Create winston logger
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      transports: [
        new winston.transports.Console({
          format: consoleFormat,
        }),
        dailyRotateTransport,
        errorRotateTransport,
      ],
    });
  }

  /**
   * Log informational message
   */
  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  /**
   * Log error message
   */
  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  /**
   * Log verbose message
   */
  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  /**
   * Log HTTP request
   */
  logHttpRequest(method: string, url: string, statusCode: number, responseTime: number) {
    this.logger.info(`${method} ${url} ${statusCode} - ${responseTime}ms`, {
      context: 'HTTP',
      method,
      url,
      statusCode,
      responseTime,
    });
  }

  /**
   * Log database query
   */
  logDatabaseQuery(query: string, duration: number) {
    this.logger.debug(`Database query executed in ${duration}ms`, {
      context: 'Database',
      query,
      duration,
    });
  }

  /**
   * Log cache operation
   */
  logCache(operation: 'HIT' | 'MISS' | 'SET', key: string, ttl?: number) {
    const message = `Cache ${operation} for key: ${key}${ttl ? ` (TTL: ${ttl}s)` : ''}`;
    this.logger.info(message, {
      context: 'Cache',
      operation,
      key,
      ttl,
    });
  }

  /**
   * Log external API call
   */
  logExternalApi(service: string, endpoint: string, statusCode: number, duration: number) {
    this.logger.info(`External API call to ${service}`, {
      context: 'ExternalAPI',
      service,
      endpoint,
      statusCode,
      duration,
    });
  }

  /**
   * Log authentication event
   */
  logAuth(event: 'LOGIN' | 'LOGOUT' | 'REGISTER' | 'REFRESH', userId: string, success: boolean) {
    this.logger.info(`Auth event: ${event} for user ${userId} - ${success ? 'SUCCESS' : 'FAILED'}`, {
      context: 'Auth',
      event,
      userId,
      success,
    });
  }

  /**
   * Get Winston logger instance (for advanced usage)
   */
  getWinstonLogger(): winston.Logger {
    return this.logger;
  }
}
