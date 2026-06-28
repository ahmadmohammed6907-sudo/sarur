/**
 * Logger utility for centralized logging
 */

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, unknown>;
  error?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  /**
   * Format log entry
   */
  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context, data, error } = entry;
    let log = `[${timestamp}] [${level}]`;

    if (context) {
      log += ` [${context}]`;
    }

    log += ` ${message}`;

    if (data) {
      log += ` ${JSON.stringify(data)}`;
    }

    if (error) {
      log += ` Error: ${error}`;
    }

    return log;
  }

  /**
   * Log message
   */
  private log(level: LogLevel, message: string, context?: string, data?: Record<string, unknown>, error?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
      error,
    };

    const formatted = this.formatLog(entry);

    // Log to console in development
    if (this.isDevelopment) {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formatted);
          break;
        case LogLevel.INFO:
          console.info(formatted);
          break;
        case LogLevel.WARN:
          console.warn(formatted);
          break;
        case LogLevel.ERROR:
          console.error(formatted);
          break;
      }
    } else {
      // In production, log to console (could be replaced with external service)
      console.log(formatted);
    }

    // TODO: Send to external logging service (e.g., Sentry, LogRocket, etc.)
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: string, data?: Record<string, unknown>) {
    this.log(LogLevel.DEBUG, message, context, data);
  }

  /**
   * Log info message
   */
  info(message: string, context?: string, data?: Record<string, unknown>) {
    this.log(LogLevel.INFO, message, context, data);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: string, data?: Record<string, unknown>) {
    this.log(LogLevel.WARN, message, context, data);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | string | unknown, context?: string, data?: Record<string, unknown>) {
    let errorMessage = "";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error) {
      errorMessage = String(error);
    }
    this.log(LogLevel.ERROR, message, context, data, errorMessage);
  }

  /**
   * Log authentication event
   */
  logAuthEvent(action: "login" | "logout" | "register" | "password_change", userId?: string, data?: Record<string, unknown>) {
    this.info(`Auth event: ${action}`, "AUTH", { userId, ...data });
  }

  /**
   * Log API request
   */
  logApiRequest(method: string, path: string, statusCode: number, duration: number) {
    this.info(`${method} ${path} - ${statusCode}`, "API", { duration: `${duration}ms` });
  }

  /**
   * Log database operation
   */
  logDbOperation(operation: string, table: string, duration: number, error?: string) {
    if (error) {
      this.error(`Database error: ${operation} on ${table}`, error, "DATABASE", { duration: `${duration}ms` });
    } else {
      this.debug(`${operation} on ${table}`, "DATABASE", { duration: `${duration}ms` });
    }
  }
}

export const logger = new Logger();
