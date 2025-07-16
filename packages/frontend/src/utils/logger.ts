/**
 * Logger utility for frontend applications
 * 
 * This module provides logging functionality with different log levels
 * and formatting options for better debugging in browser environments.
 */

// Log levels from highest (most restrictive) to lowest (most verbose)
export enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3
}

// Default to INFO in production, DEBUG in development
const DEFAULT_LOG_LEVEL: LogLevel = process.env.NODE_ENV === 'production'
    ? LogLevel.INFO
    : LogLevel.DEBUG;

// Current log level - can be overridden via environment variable
const CURRENT_LOG_LEVEL: LogLevel = parseInt(
    (process.env.REACT_APP_LOG_LEVEL as string) || DEFAULT_LOG_LEVEL.toString(),
    10
) as LogLevel;

/**
 * Format the log message with timestamp and optional context
 * 
 * @param level - Log level label (ERROR, WARN, INFO, DEBUG)
 * @param message - Log message
 * @param context - Additional contextual information
 * @returns Formatted log message
 */
function formatLogMessage(level: string, message: string, context: Record<string, any> = {}): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
}

/**
 * Logger class providing different log levels and formatting
 */
export class Logger {
    private module: string;

    /**
     * Create a logger instance
     * @param module - Name of the module using this logger
     */
    constructor(module: string) {
        this.module = module;
    }

    /**
     * Log an error message
     * 
     * @param message - Error message
     * @param error - Error object or context
     */
    error(message: string, error: Error | Record<string, any> = {}): void {
        if (CURRENT_LOG_LEVEL >= LogLevel.ERROR) {
            const context = error instanceof Error
                ? { errorMessage: error.message, stack: error.stack }
                : error;

            console.error(formatLogMessage(
                'ERROR',
                `[${this.module}] ${message}`
            ), context);
        }
    }

    /**
     * Log a warning message
     * 
     * @param message - Warning message
     * @param context - Additional context
     */
    warn(message: string, context: Record<string, any> = {}): void {
        if (CURRENT_LOG_LEVEL >= LogLevel.WARN) {
            console.warn(formatLogMessage(
                'WARN',
                `[${this.module}] ${message}`
            ), context);
        }
    }

    /**
     * Log an info message
     * 
     * @param message - Info message
     * @param context - Additional context
     */
    info(message: string, context: Record<string, any> = {}): void {
        if (CURRENT_LOG_LEVEL >= LogLevel.INFO) {
            console.log(formatLogMessage(
                'INFO',
                `[${this.module}] ${message}`
            ), context);
        }
    }

    /**
     * Log a debug message
     * 
     * @param message - Debug message
     * @param context - Additional context
     */
    debug(message: string, context: Record<string, any> = {}): void {
        if (CURRENT_LOG_LEVEL >= LogLevel.DEBUG) {
            console.debug(formatLogMessage(
                'DEBUG',
                `[${this.module}] ${message}`
            ), context);
        }
    }

    /**
     * Log performance timing for operations
     * 
     * @param operation - Operation being timed
     * @param fn - Function to time (can return a value or Promise)
     * @returns Return value from the function
     */
    async time<T>(operation: string, fn: Promise<T> | (() => Promise<T> | T) | T): Promise<T> {
        const start = performance.now();
        try {
            if (fn instanceof Promise) {
                return await fn;
            } else if (typeof fn === 'function') {
                const func = fn as () => Promise<T> | T;
                const result = func();
                return (result instanceof Promise) ? await result : result;
            }
            return fn as T;
        } finally {
            const duration = performance.now() - start;
            this.debug(`Operation ${operation} took ${duration.toFixed(2)}ms`);
        }
    }

    /**
     * Creates a logger instance for a specific component or feature
     * 
     * @param component - Name of the component or feature
     * @returns Logger instance with combined module and component context
     */
    forComponent(component: string): Logger {
        return new Logger(`${this.module}:${component}`);
    }
}

/**
 * Create a logger instance for a specific module
 * 
 * @param module - Name of the module
 * @returns Logger instance for the module
 */
export function createLogger(module: string): Logger {
    return new Logger(module);
}

export default createLogger;
