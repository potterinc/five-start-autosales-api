import express, { Response, response } from "express";


/**
 * @description Custom Error model is not found
 */
class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError'
  }
}

/** @description Custom Error for failed server responses */
class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerError'
  }
}

/** @description Custom Error for failed server responses */
class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError'
  }
}
/** @description Custom Error for failed server responses */
class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError'
  }
}

/**
 * @description Custom Error for failed server responses
 */
class DuplicateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateError'
  }
}

/**@description Custom error for invalid request */
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError'
  }
}

/**@description Custom error for invalid reference mostly cast errors */
class ReferenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReferenceError'
  }
}
/**
 * @description Handles all mongoose validation errors based on the schema provided
 * @throws Error
 */
class MongooseValidationErrorHandler {
  dataBaseModel: any;
  /**
   * 
   * @param e Error object
   * @param schema Schema object or interface
   */
  constructor(private e: Error | unknown, schema: any) {
    this.dataBaseModel = schema.schema.paths;
    this.handleError(this.e)
  }

  /**
   * 
   * @param error Error object
   */
  private handleError(error: Error | unknown | any) {
    switch (error.name) {
      case 'ValidationError': {
        for (let path in this.dataBaseModel) {
          if (error.errors[`${path}`])
            throw new ValidationError(error.errors[`${path}`].message);
        }
      }
        break;
      case 'MongoServerError':
        const duplicateKey = Object.keys(error.keyValue)[0];
        const VALUE = error.keyValue[duplicateKey];
        throw new DuplicateError('FAILED: ${VALUE} already exist');
      default:
        throw new Error(error.message)
    }
  }
}

class ErrorResponseHandler {
  constructor(private e: Error | unknown | any, private res: Response) {
    this.errorResponse(this.e)
  }

  private errorResponse(err: Error | unknown | any) {
    switch (err.name) {
      case 'ValidationError':
        return this.res.status(400).json({
          success: false,
          message: err.message
        });
      case 'UnauthorizedError':
        return this.res.status(401).json({
          success: false,
          message: err.message
        });
      case 'ForbiddenError':
        return this.res.status(403).json({
          success: false,
          message: err.message
        });
      case 'NotFoundError':
        return this.res.status(404).json({
          success: false,
          message: err.message
        });
      case 'DuplicateError':
        return this.res.status(409).json({
          success: false,
          message: err.message
        });
      case 'ServerError':
        return this.res.status(500).json({
          success: false,
          message: err.message
        });
      case 'ReferenceError':
        return this.res.status(500).json({
          success: false,
          message: err.message
        })
      default:
        return this.res.status(500).json({
          success: false,
          message: `Something went wrong: ${err.message}`
        })
    }
  }
}


export default MongooseValidationErrorHandler;
export {
  ServerError,
  NotFoundError,
  ValidationError,
  ErrorResponseHandler,
  ReferenceError,
  DuplicateError,
  UnauthorizedError,
  ForbiddenError
}
