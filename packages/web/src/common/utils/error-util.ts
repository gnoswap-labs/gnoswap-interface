import { BaseError } from "@common/errors";
import { ErrorResponse } from "@common/errors/response";

export const returnNullWithLog = (error?: Error) => {
  if (error) {
    console.log(error);
  }
  return null;
};

export const returnNullWithNotification = (error?: Error) => {
  if (error) {
    // TODO: Add notification hook
    console.log(error);
  }
  return null;
};

export const returnErrorResponse = <T = any>(
  error: Error,
  data?: T,
): ErrorResponse<T> => {
  if (error && error instanceof BaseError) {
    return createErrorResponse<T>(error, data);
  }

  console.log(error);
  throw new Error("Unknown Error.");
};

const createErrorResponse = <T = any>(
  error: BaseError,
  data?: T,
): ErrorResponse<T> => {
  return {
    isError: true,
    status: error.getStatus(),
    type: error.getType(),
    message: error.message,
    data: data ?? null,
  };
};
