import { FallbackRpcClient } from "./fallback-rpc-client";
import { RpcEndpointSelector } from "./rpc-endpoint-selector";

const PRIMARY = "https://primary.rpc";
const FALLBACK = "https://fallback.rpc";

const execute = jest.fn();
const disconnect = jest.fn();
const constructed: string[] = [];

jest.mock("@gnolang/tm2-rpc", () => ({
  HttpClient: jest.fn().mockImplementation((endpoint: string) => {
    constructed.push(endpoint);
    return {
      execute: (request: unknown) => execute(endpoint, request),
      disconnect,
    };
  }),
}));

const REQUEST = { jsonrpc: "2.0" as const, id: 1, method: "status", params: {} };

function unreachable(endpoint: string): Error {
  return new Error(`Failed to fetch ${endpoint}`);
}

describe("FallbackRpcClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    constructed.length = 0;
  });

  it("retries on the fallback endpoint when the primary is unreachable", async () => {
    execute.mockImplementation(async (endpoint: string) => {
      if (endpoint === PRIMARY) {
        throw unreachable(endpoint);
      }
      return { jsonrpc: "2.0", id: 1, result: endpoint };
    });
    const client = new FallbackRpcClient(new RpcEndpointSelector(PRIMARY, FALLBACK), 1_000);

    await expect(client.execute(REQUEST)).resolves.toEqual({ jsonrpc: "2.0", id: 1, result: FALLBACK });
    expect(execute.mock.calls.map(([endpoint]) => endpoint)).toEqual([PRIMARY, FALLBACK]);
  });

  it("reuses one HTTP client per endpoint and disconnects all of them", async () => {
    execute.mockImplementation(async (endpoint: string) => {
      if (endpoint === PRIMARY) {
        throw unreachable(endpoint);
      }
      return { jsonrpc: "2.0", id: 1, result: endpoint };
    });
    const client = new FallbackRpcClient(new RpcEndpointSelector(PRIMARY, FALLBACK), 1_000);

    await client.execute(REQUEST);
    await client.execute(REQUEST);

    expect(constructed).toEqual([PRIMARY, FALLBACK]);
    client.disconnect();
    expect(disconnect).toHaveBeenCalledTimes(2);
  });

  it("moves on to the fallback once an endpoint stops answering at all", async () => {
    execute.mockImplementation((endpoint: string) => {
      // A blackholed node never rejects on its own, so only the timeout can
      // rotate away from it.
      if (endpoint === PRIMARY) {
        return new Promise(() => undefined);
      }
      return Promise.resolve({ jsonrpc: "2.0", id: 1, result: endpoint });
    });
    const client = new FallbackRpcClient(new RpcEndpointSelector(PRIMARY, FALLBACK), 10);

    await expect(client.execute(REQUEST)).resolves.toEqual({ jsonrpc: "2.0", id: 1, result: FALLBACK });
  });
});
