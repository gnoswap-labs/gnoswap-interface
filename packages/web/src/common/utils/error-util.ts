import { BaseError } from "@common/errors";
import { ErrorResponse } from "@common/errors/response";

/**
 * Logs an error and returns null
 * @param error - Optional error to log
 * @returns Always returns null
 * @example
 * const result = someOperation() ?? returnNullWithLog(new Error("Operation failed"));
 */
export const returnNullWithLog = (error?: Error): null => {
  if (error) {
    // TODO(notJoon): console.error?
    console.log(error);
  }
  return null;
};

/**
 * Logs an error and returns null, intended for user notification
 * @param error - Optional error to log and notify
 * @returns Always returns null
 * @todo Add notification hook implementation
 * @example
 * const data = fetchData() ?? returnNullWithNotification(new Error("Failed to fetch data"));
 */
export const returnNullWithNotification = (error?: Error): null => {
  if (error) {
    // TODO: Add notification hook
    // TODO(notJoon): console.error?
    console.log(error);
  }
  return null;
};

/**
 * Type guard to check if an error is a BaseError instance
 * @param error - The error to check
 * @returns true if the error is a BaseError
 */
const isBaseError = (error: unknown): error is BaseError => {
  return error instanceof BaseError;
};

/**
 * Creates an error response object or throws for unknown errors
 * @param error - The error to process
 * @param data - Optional data to include in the response
 * @returns ErrorResponse object for BaseError instances
 * @throws Error for non-BaseError instances
 * @example
 * try {
 *   return returnErrorResponse(new BaseError({ type: "NETWORK_ERROR", status: 500, message: "Failed" }));
 * } catch (e) {
 *   // Handle unknown error
 * }
 */
export const returnErrorResponse = <T = unknown>(error: Error, data?: T): ErrorResponse<T> | never => {
  if (isBaseError(error)) {
    return createErrorResponse<T>(error, data);
  }

  console.log(error);
  throw new Error("Unknown Error.");
};

/**
 * Creates an ErrorResponse object from a BaseError
 * @param error - BaseError instance
 * @param data - Optional data to include
 * @returns Formatted error response
 */
const createErrorResponse = <T = unknown>(error: BaseError, data?: T): ErrorResponse<T> => {
  return {
    isError: true,
    status: error.getStatus(),
    type: error.getType(),
    message: error.message,
    data: data ?? null,
  };
};

/**
 * Result type for operations that can fail
 * @template T - Success data type
 * @template E - Error type (defaults to Error)
 * @todo Consider using a more robust Result/Either type library or pattern
 * for better error handling composition (like effect-ts)
 */
type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

/**
 * Safely executes an async function and returns a Result
 * @param fn - Async function to execute
 * @returns Promise with Result containing either success data or error
 * @example
 * const result = await safeAsync(async () => {
 *   return await fetchUserData();
 * });
 * if (result.success) {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error);
 * }
 */
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

/**
 * Safely executes a synchronous function and returns a Result
 * @param fn - Function to execute
 * @returns Result containing either success data or error
 * @example
 * const result = safeSync(() => {
 *   return JSON.parse(jsonString);
 * });
 * if (result.success) {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error);
 * }
 */
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

/**
 * Configuration for error handling strategies
 * @template T - Return type of handlers
 */
type ErrorHandler<T> = {
  onBaseError?: (error: BaseError) => T;
  onGenericError?: (error: Error) => T;
  onUnknown?: (error: unknown) => T;
};

/**
 * Handles errors with type-specific strategies
 * @param error - The error to handle
 * @param handlers - Object with handler functions for different error types
 * @returns Result from the matching handler
 * @throws If no handler matches and error is not handled
 * @example
 * const result = handleError(error, {
 *   onBaseError: (e) => ({ status: e.getStatus(), message: e.message }),
 *   onGenericError: (e) => ({ status: 500, message: e.message }),
 *   onUnknown: () => ({ status: 500, message: "Unknown error" })
 * });
 */
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
