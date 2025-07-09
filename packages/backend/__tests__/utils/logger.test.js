/**
 * Unit tests for the backend logger utility
 */

const { createLogger, LOG_LEVELS } = require('../../src/utils/logger');

describe('Backend Logger', () => {
    let originalConsole;
    let mockConsole;

    beforeEach(() => {
        // Mock console methods
        originalConsole = { ...console };
        mockConsole = {
            log: jest.fn(),
            debug: jest.fn(),
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn()
        };

        global.console = mockConsole;
    });

    afterEach(() => {
        // Restore original console
        global.console = originalConsole;
    });

    test('createLogger returns a logger instance', () => {
        const logger = createLogger('TestModule');
        expect(logger).toBeDefined();
        expect(typeof logger.debug).toBe('function');
        expect(typeof logger.info).toBe('function');
        expect(typeof logger.warn).toBe('function');
        expect(typeof logger.error).toBe('function');
    });

    test('logger.error should call console.error', () => {
        const logger = createLogger('TestModule');
        logger.error('Test error message');
        expect(mockConsole.error).toHaveBeenCalled();

        const errorArg = mockConsole.error.mock.calls[0][0];
        expect(errorArg).toContain('[ERROR]');
        expect(errorArg).toContain('[TestModule]');
        expect(errorArg).toContain('Test error message');
    });

    test('logger.warn should call console.warn', () => {
        const logger = createLogger('TestModule');
        logger.warn('Test warning message');
        expect(mockConsole.warn).toHaveBeenCalled();

        const warnArg = mockConsole.warn.mock.calls[0][0];
        expect(warnArg).toContain('[WARN]');
        expect(warnArg).toContain('[TestModule]');
        expect(warnArg).toContain('Test warning message');
    });

    test('logger.info should call console.log', () => {
        const logger = createLogger('TestModule');
        logger.info('Test info message');
        expect(mockConsole.log).toHaveBeenCalled();

        const infoArg = mockConsole.log.mock.calls[0][0];
        expect(infoArg).toContain('[INFO]');
        expect(infoArg).toContain('[TestModule]');
        expect(infoArg).toContain('Test info message');
    });

    test('logger.debug should call console.debug', () => {
        const logger = createLogger('TestModule');
        logger.debug('Test debug message');
        expect(mockConsole.debug).toHaveBeenCalled();

        const debugArg = mockConsole.debug.mock.calls[0][0];
        expect(debugArg).toContain('[DEBUG]');
        expect(debugArg).toContain('[TestModule]');
        expect(debugArg).toContain('Test debug message');
    });

    test('logger.error should handle Error objects', () => {
        const logger = createLogger('TestModule');
        const error = new Error('Test error');

        logger.error('An error occurred', error);
        expect(mockConsole.error).toHaveBeenCalled();

        const errorArg = mockConsole.error.mock.calls[0][0];
        expect(errorArg).toContain('[ERROR]');
        expect(errorArg).toContain('An error occurred');
        expect(errorArg).toContain('Test error');
    });

    test('logger.withOperation should return a new logger with combined context', () => {
        const logger = createLogger('TestModule');
        const operationLogger = logger.withOperation('TestOperation');

        operationLogger.info('Operation info');
        expect(mockConsole.log).toHaveBeenCalled();

        const infoArg = mockConsole.log.mock.calls[0][0];
        expect(infoArg).toContain('[TestModule:TestOperation]');
    });
});
