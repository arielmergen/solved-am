import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../middleware/error';

describe('Error Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    // Silenciar console.error durante los tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restaurar console.error después de cada test
    consoleErrorSpy.mockRestore();
  });

  it('should handle custom errors with status code', () => {
    const customError = new Error('Custom error message');
    (customError as any).statusCode = 400;

    errorHandler(customError, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 400,
      message: 'Custom error message'
    });
  });

  it('should handle errors without status code (default to 500)', () => {
    const error = new Error('Internal server error');

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 500,
      message: 'Internal server error'
    });
  });

  it('should include stack trace in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const error = new Error('Test error');
    error.stack = 'Test stack trace';

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        stack: 'Test stack trace'
      })
    );

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle errors without message', () => {
    const error = new Error();

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 500,
      message: 'Algo salió mal'
    });
  });
}); 