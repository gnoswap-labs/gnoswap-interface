import { BaseError } from "@common/errors";
import { ErrorResponse } from "@common/errors/response";

// Explicit return type for null returns
export const returnNullWithLog = (error?: Error): null => {
  if (error) {
    console.log(error);
  }
  return null;
};

export const returnNullWithNotification = (error?: Error): null => {
  if (error) {
    // TODO: Add notification hook
    console.log(error);
  }
  return null;
};

// Type guard for BaseError
const isBaseError = (error: unknown): error is BaseError => {
  return error instanceof BaseError;
};

// Enhanced error response with never type for throw
export const returnErrorResponse = <T = unknown>(error: Error, data?: T): ErrorResponse<T> | never => {
  if (isBaseError(error)) {
    return createErrorResponse<T>(error, data);
  }

  console.log(error);
  throw new Error("Unknown Error.");
};

// Private helper with explicit return type
const createErrorResponse = <T = unknown>(error: BaseError, data?: T): ErrorResponse<T> => {
  return {
    isError: true,
    status: error.getStatus(),
    type: error.getType(),
    message: error.message,
    data: data ?? null,
  };
};

// Result type for better error handling
type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

// Safe wrapper for async operations
export const safeAsync = async <T>(fn: () => Promise<T>): Promise<Result<T>> => {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

// Safe wrapper for sync operations
export const safeSync = <T>(fn: () => T): Result<T> => {
  try {
    const data = fn();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

// Type-safe error handler with exhaustive checking
type ErrorHandler<T> = {
  onBaseError?: (error: BaseError) => T;
  onGenericError?: (error: Error) => T;
  onUnknown?: (error: unknown) => T;
};

export const handleError = <T>(error: unknown, handlers: ErrorHandler<T>): T => {
  if (isBaseError(error) && handlers.onBaseError) {
    return handlers.onBaseError(error);
  }

  if (error instanceof Error && handlers.onGenericError) {
    return handlers.onGenericError(error);
  }

  if (handlers.onUnknown) {
    return handlers.onUnknown(error);
  }

  // Default behavior if no handler matches
  throw error;
};

