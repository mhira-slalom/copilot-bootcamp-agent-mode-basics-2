/**
 * Simple logging utility that respects the NODE_ENV environment variable
 *
 * @fileoverview This file contains utilities for logging that respect the current environment
 * @eslint-disable no-console
 */
/* eslint-disable no-console */
const logger = {
  /**
   * Log informational message
   * @param {string} message - The message to log
   * @param  {...any} args - Additional arguments to log
   */
  info: (message, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(message, ...args);
    }
  },

  /**
   * Log error message
   * @param {string} message - The error message to log
   * @param  {...any} args - Additional arguments (like Error objects)
   */
  error: (message, ...args) => {
    // Always log errors, but could implement more sophisticated
    // error handling like sending to a monitoring service
    console.error(message, ...args);
  },

  /**
   * Log warning message
   * @param {string} message - The warning message to log
   * @param  {...any} args - Additional arguments
   */
  warn: (message, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(message, ...args);
    }
  },

  /**
   * Log debug message (only in development)
   * @param {string} message - The debug message to log
   * @param  {...any} args - Additional arguments
   */
  debug: (message, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(message, ...args);
    }
  },
};

export default logger;
