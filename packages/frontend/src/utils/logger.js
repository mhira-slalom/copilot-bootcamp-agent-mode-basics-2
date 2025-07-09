/**
 * Logger utility for frontend applications
 * 
 * This module provides logging functionality with different log levels
 * and formatting options for better debugging in browser environments.
 */

// Log levels from highest (most restrictive) to lowest (most verbose)
export const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
};

// Default to INFO in production, DEBUG in development
const DEFAULT_LOG_LEVEL = process.env.NODE_ENV === 'production'
    ? LOG_LEVELS.INFO
    : LOG_LEVELS.DEBUG;

// Current log level - can be overridden via environment variable
const CURRENT_LOG_LEVEL = parseInt(process.env.REACT_APP_LOG_LEVEL, 10) || DEFAULT_LOG_LEVEL;

/**
 * Format the log message with timestamp and optional context
 * 
 * @param {string} level - Log level label (ERROR, WARN, INFO, DEBUG)
 * @param {string} message - Log message
 * @param {Object} context - Additional contextual information
 * @returns {string} Formatted log message
 */
function formatLogMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
}

/**
 * Logger class providing different log levels and formatting
 */
class Logger {
    /**
     * Create a logger instance
     * @param {string} module - Name of the module using this logger
     */
    constructor(module) {
        this.module = module;
    }

    /**
     * Log an error message
     * 
     * @param {string} message - Error message
     * @param {Error|Object} [error] - Error object or context
     */
    error(message, error = {}) {
        if (CURRENT_LOG_LEVEL >= LOG_LEVELS.ERROR) {
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
     * @param {string} message - Warning message
     * @param {Object} [context] - Additional context
     */
    warn(message, context = {}) {
        if (CURRENT_LOG_LEVEL >= LOG_LEVELS.WARN) {
            console.warn(formatLogMessage(
                'WARN',
                `[${this.module}] ${message}`
            ), context);
        }
    }

    /**
     * Log an info message
     * 
     * @param {string} message - Info message
     * @param {Object} [context] - Additional context
     */
    info(message, context = {}) {
        if (CURRENT_LOG_LEVEL >= LOG_LEVELS.INFO) {
            console.log(formatLogMessage(
                'INFO',
                `[${this.module}] ${message}`
            ), context);
        }
    }

    /**
     * Log a debug message
     * 
     * @param {string} message - Debug message
     * @param {Object} [context] - Additional context
     */
    debug(message, context = {}) {
        if (CURRENT_LOG_LEVEL >= LOG_LEVELS.DEBUG) {
            console.debug(formatLogMessage(
                'DEBUG',
                `[${this.module}] ${message}`
            ), context);
        }
    }

    /**
     * Log performance timing for operations
     * 
     * @param {string} operation - Operation being timed
     * @param {function} fn - Function to time (can return a value or Promise)
     * @returns {*} Return value from the function
     */
    async time(operation, fn) {
        const start = performance.now();
        try {
            if (fn instanceof Promise) {
                return await fn;
            } else if (typeof fn === 'function') {
                return await fn();
            }
            return fn;
        } finally {
            const duration = performance.now() - start;
            this.debug(`Operation ${operation} took ${duration.toFixed(2)}ms`);
        }
    }

    /**
     * Creates a logger instance for a specific component or feature
     * 
     * @param {string} component - Name of the component or feature
     * @returns {Logger} Logger instance with combined module and component context
     */
    forComponent(component) {
        return new Logger(`${this.module}:${component}`);
    }
}

/**
 * Create a logger instance for a specific module
 * 
 * @param {string} module - Name of the module
 * @returns {Logger} Logger instance for the module
 */
export function createLogger(module) {
    return new Logger(module);
}

export default createLogger;
