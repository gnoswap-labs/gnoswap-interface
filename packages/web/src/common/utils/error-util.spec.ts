import { BaseError } from "@common/errors";
import {
  returnNullWithLog,
  returnNullWithNotification,
  returnErrorResponse,
  safeAsync,
  safeSync,
  handleError,
} from "./error-util";

// Mock BaseError class
class MockBaseError extends BaseError {
  constructor(message: string, status: number, type: string) {
    super({ type, status, message });
  }
}

describe("error-util.improved", () => {
  // Mock console.log
  const originalConsoleLog = console.log;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    console.log = originalConsoleLog;
  });

  describe("returnNullWithLog", () => {
    it("should return null without error", () => {
      const result = returnNullWithLog();
      expect(result).toBeNull();
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("should log error and return null", () => {
      const error = new Error("Test error");
      const result = returnNullWithLog(error);
      expect(result).toBeNull();
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
    });
  });

  describe("returnNullWithNotification", () => {
    it("should return null without error", () => {
      const result = returnNullWithNotification();
      expect(result).toBeNull();
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("should log error and return null (notification TODO)", () => {
      const error = new Error("Test error");
      const result = returnNullWithNotification(error);
      expect(result).toBeNull();
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
    });
  });

  describe("returnErrorResponse", () => {
    it("should return error response for BaseError", () => {
      const error = new MockBaseError("Test error", 400, "BAD_REQUEST");
      const result = returnErrorResponse(error);

      expect(result).toEqual({
        isError: true,
        status: 400,
        type: "BAD_REQUEST",
        message: "Test error",
        data: null,
      });
    });

    it("should return error response with custom data", () => {
      const error = new MockBaseError("Test error", 404, "NOT_FOUND");
      const customData = { id: 123 };
      const result = returnErrorResponse(error, customData);

      expect(result).toEqual({
        isError: true,
        status: 404,
        type: "NOT_FOUND",
        message: "Test error",
        data: customData,
      });
    });

    it("should throw for non-BaseError", () => {
      const error = new Error("Regular error");
      expect(() => returnErrorResponse(error)).toThrow("Unknown Error.");
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
    });
  });

  describe("safeAsync", () => {
    it("should return success result for successful async operation", async () => {
      const asyncFn = async () => "success";
      const result = await safeAsync(asyncFn);

      expect(result).toEqual({
        success: true,
        data: "success",
      });
    });

    it("should return error result for failed async operation", async () => {
      const error = new Error("Async error");
      const asyncFn = async () => {
        throw error;
      };
      const result = await safeAsync(asyncFn);

      expect(result).toEqual({
        success: false,
        error: error,
      });
    });

    it("should handle non-Error throws", async () => {
      const asyncFn = async () => {
        throw "string error";
      };
      const result = await safeAsync(asyncFn);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("string error");
      }
    });

    it("should handle rejected promises", async () => {
      const asyncFn = () => Promise.reject(new Error("Rejected"));
      const result = await safeAsync(asyncFn);

      expect(result).toEqual({
        success: false,
        error: new Error("Rejected"),
      });
    });
  });

  describe("safeSync", () => {
    it("should return success result for successful sync operation", () => {
      const syncFn = () => "success";
      const result = safeSync(syncFn);

      expect(result).toEqual({
        success: true,
        data: "success",
      });
    });

    it("should return error result for failed sync operation", () => {
      const error = new Error("Sync error");
      const syncFn = () => {
        throw error;
      };
      const result = safeSync(syncFn);

      expect(result).toEqual({
        success: false,
        error: error,
      });
    });

    it("should handle non-Error throws", () => {
      const syncFn = () => {
        throw "string error";
      };
      const result = safeSync(syncFn);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("string error");
      }
    });
  });

  describe("handleError", () => {
    it("should handle BaseError with specific handler", () => {
      const error = new MockBaseError("Base error", 500, "INTERNAL_ERROR");
      const result = handleError(error, {
        onBaseError: e => `BaseError: ${e.getType()}`,
      });

      expect(result).toBe("BaseError: INTERNAL_ERROR");
    });

    it("should handle generic Error with specific handler", () => {
      const error = new Error("Generic error");
      const result = handleError(error, {
        onGenericError: e => `Error: ${e.message}`,
      });

      expect(result).toBe("Error: Generic error");
    });

    it("should handle unknown error with specific handler", () => {
      const error = "string error";
      const result = handleError(error, {
        onUnknown: e => `Unknown: ${e}`,
      });

      expect(result).toBe("Unknown: string error");
    });

    it("should prioritize BaseError handler over generic Error handler", () => {
      const error = new MockBaseError("Base error", 400, "BAD_REQUEST");
      const result = handleError(error, {
        onBaseError: () => "base",
        onGenericError: () => "generic",
      });

      expect(result).toBe("base");
    });

    it("should throw if no matching handler", () => {
      const error = new Error("Unhandled error");
      expect(() => handleError(error, {})).toThrow("Unhandled error");
    });

    it("should handle complex error scenarios", () => {
      const handlers = {
        onBaseError: (e: BaseError) => ({ handled: true, type: e.getType() }),
        onGenericError: (e: Error) => ({ handled: true, message: e.message }),
        onUnknown: (e: unknown) => ({ handled: true, value: String(e) }),
      };

      // Test BaseError
      const baseError = new MockBaseError("Base", 400, "BAD_REQUEST");
      expect(handleError(baseError, handlers)).toEqual({
        handled: true,
        type: "BAD_REQUEST",
      });

      // Test regular Error
      const regularError = new Error("Regular");
      expect(handleError(regularError, handlers)).toEqual({
        handled: true,
        message: "Regular",
      });

      // Test unknown
      expect(handleError(123, handlers)).toEqual({
        handled: true,
        value: "123",
      });
    });
  });
});
