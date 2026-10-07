import axios, { AxiosError } from "axios";

import { FallbackRpcClient } from "./fallback-rpc-client";
import { JsonRpcResponseError } from "./json-rpc-response-error";
import { RpcEndpointSelector } from "./rpc-endpoint-selector";

const PRIMARY = "https://primary.rpc";
const FALLBACK = "https://fallback.rpc";
const REQUEST = { jsonrpc: "2.0" as const, id: 7, method: "status", params: {} };

function answers(result: unknown): { data: unknown } {
  return { data: { jsonrpc: "2.0", id: REQUEST.id, result } };
}

describe("FallbackRpcClient", () => {
  const post = jest.spyOn(axios, "post");

  afterEach(() => {
    post.mockReset();
  });

  afterAll(() => {
    post.mockRestore();
  });

  it("retries on the fallback endpoint when the primary is unreachable", async () => {
    post.mockImplementation(async (endpoint: string) => {
      if (endpoint === PRIMARY) {
        throw new AxiosError("Network Error", AxiosError.ERR_NETWORK);
      }
      return answers(endpoint);
    });
    const client = new FallbackRpcClient(new RpcEndpointSelector(PRIMARY, FALLBACK));

    await expect(client.execute(REQUEST)).resolves.toEqual({ jsonrpc: "2.0", id: REQUEST.id, result: FALLBACK });
    expect(post.mock.calls.map(([endpoint]) => endpoint)).toEqual([PRIMARY, FALLBACK]);
  });

  it("bounds every request, so an endpoint that never answers still rotates", async () => {
    post.mockImplementation(async (endpoint: string) => {
      if (endpoint === PRIMARY) {
        // What axios raises once it aborts the request on its own timeout.
        throw new AxiosError("timeout of 10000ms exceeded", AxiosError.ECONNABORTED);
      }
      return answers(endpoint);
    });
    const client = new FallbackRpcClient(new RpcEndpointSelector(PRIMARY, FALLBACK), 10_000);

    await expect(client.execute(REQUEST)).resolves.toEqual({ jsonrpc: "2.0", id: REQUEST.id, result: FALLBACK });
    expect(post).toHaveBeenNthCalledWith(1, PRIMARY, REQUEST, { timeout: 10_000 });
  });

  it("raises a response error, and does not fail over, when the node answers with one", async () => {
    post.mockResolvedValue({ data: { jsonrpc: "2.0", id: REQUEST.id, error: { code: -32603, message: "timeout" } } });
    const client = new FallbackRpcClient(new RpcEndpointSelector(PRIMARY, FALLBACK));

    // The message mentions a timeout, which must not be mistaken for one.
    await expect(client.execute(REQUEST)).rejects.toBeInstanceOf(JsonRpcResponseError);
    expect(post).toHaveBeenCalledTimes(1);
  });

  it("rejects an endpoint URL without a protocol instead of posting to a relative path", () => {
    expect(() => new FallbackRpcClient(new RpcEndpointSelector(""))).toThrow("missing a protocol");
  });
});
