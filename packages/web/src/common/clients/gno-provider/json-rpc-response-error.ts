/**
 * Raised when a node answered the JSON-RPC call but the answer was not a
 * success: either an `error` member, or a body that is not a JSON-RPC response
 * at all. The endpoint is alive in both cases, so failing over to another one
 * would only reproduce the same answer.
 */
export class JsonRpcResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JsonRpcResponseError";
    Object.setPrototypeOf(this, JsonRpcResponseError.prototype);
  }
}
