import axios from "axios";

import { JsonRpcResponseError } from "./json-rpc-response-error";

function isServerSideStatus(status: number): boolean {
  return status >= 500 || status === 429;
}

/**
 * Whether a rejected RPC call means "this endpoint is not answering" rather
 * than "the chain answered, and the answer was an error". Only the former may
 * trigger a fallback, since the fallback would reproduce the latter anyway.
 *
 * The two are told apart by the shape of the error, never by its message: a
 * node is free to answer with any text it likes, and a JSON-RPC error that
 * happens to mention a timeout is still an answer from a healthy endpoint.
 */
export function isTransportError(error: unknown): boolean {
  if (!error) {
    return false;
  }

  // The endpoint answered, whatever the answer was.
  if (error instanceof JsonRpcResponseError) {
    return false;
  }

  if (axios.isAxiosError(error)) {
    // No response at all covers a refused connection, a DNS failure, and the
    // request timeout aborted by axios itself.
    return !error.response || isServerSideStatus(error.response.status);
  }

  return false;
}

/**
 * A network's RPC endpoints used as a ring: the configured `rpcUrl`, then the
 * optional `fallbackRpcUrl`.
 *
 * Requests start on `rpcUrl`. A transport failure rotates to the next endpoint
 * and retries there, and the rotation sticks, so the retry and every later
 * request use `fallbackRpcUrl` instead of paying the dead endpoint's timeout
 * again. A transport failure on `fallbackRpcUrl` rotates back to `rpcUrl` the
 * same way. Each `run` walks every endpoint at most once before giving up.
 */
export class RpcEndpointSelector {
  private readonly endpoints: string[];

  private activeIndex = 0;

  constructor(rpcUrl: string, fallbackRpcUrl?: string) {
    this.endpoints = fallbackRpcUrl && fallbackRpcUrl !== rpcUrl ? [rpcUrl, fallbackRpcUrl] : [rpcUrl];
  }

  public get all(): readonly string[] {
    return this.endpoints;
  }

  public get count(): number {
    return this.endpoints.length;
  }

  public get active(): string {
    return this.endpoints[this.activeIndex];
  }

  public async run<T>(request: (endpoint: string) => Promise<T>): Promise<T> {
    let lastTransportError: unknown;

    // The sequence is fixed up front rather than re-read from the shared active
    // index on every attempt, so that "each run walks every endpoint at most
    // once" holds on its own rather than resting on where a concurrent run left
    // the shared index.
    const startingIndex = this.activeIndex;

    for (let attempt = 0; attempt < this.endpoints.length; attempt++) {
      const attemptedIndex = (startingIndex + attempt) % this.endpoints.length;

      try {
        return await request(this.endpoints[attemptedIndex]);
      } catch (error) {
        if (!isTransportError(error)) {
          throw error;
        }

        lastTransportError = error;
        this.rotateFrom(attemptedIndex);
      }
    }

    throw lastTransportError;
  }

  private rotateFrom(attemptedIndex: number): void {
    // A concurrent request may already have rotated away from the endpoint this
    // call tried; leave its choice alone rather than rotating twice.
    if (this.activeIndex !== attemptedIndex) {
      return;
    }

    this.activeIndex = (attemptedIndex + 1) % this.endpoints.length;
  }
}
