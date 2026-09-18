import { AxiosError, AxiosHeaders } from "axios";

import { isTransportError, RpcEndpointSelector } from "./rpc-endpoint-selector";

const PRIMARY = "https://primary.rpc";
const FALLBACK = "https://fallback.rpc";

function axiosErrorWithStatus(status: number): AxiosError {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError("Request failed", "ERR_BAD_RESPONSE", config, null, {
    status,
    statusText: "",
    headers: {},
    config,
    data: null,
  });
}

describe("RpcEndpointSelector", () => {
  it("rotates to the fallback and retries the same request there", async () => {
    const selector = new RpcEndpointSelector(PRIMARY, FALLBACK);
    const request = jest.fn(async (endpoint: string) => {
      if (endpoint === PRIMARY) {
        throw new Error("Failed to fetch");
      }
      return endpoint;
    });

    await expect(selector.run(request)).resolves.toBe(FALLBACK);
    expect(request.mock.calls.map(([endpoint]) => endpoint)).toEqual([PRIMARY, FALLBACK]);
  });

  it("keeps using the fallback once it rotated, instead of paying the dead endpoint again", async () => {
    const selector = new RpcEndpointSelector(PRIMARY, FALLBACK);
    const request = jest.fn(async (endpoint: string) => {
      if (endpoint === PRIMARY) {
        throw new Error("Failed to fetch");
      }
      return endpoint;
    });

    await selector.run(request);
    await expect(selector.run(request)).resolves.toBe(FALLBACK);

    expect(selector.active).toBe(FALLBACK);
    expect(request).toHaveBeenCalledTimes(3);
  });

  it("rotates back to the primary once the fallback stops answering", async () => {
    const selector = new RpcEndpointSelector(PRIMARY, FALLBACK);

    await selector.run(async endpoint => {
      if (endpoint === PRIMARY) {
        throw new Error("Failed to fetch");
      }
      return endpoint;
    });

    await expect(
      selector.run(async endpoint => {
        if (endpoint === FALLBACK) {
          throw new Error("Failed to fetch");
        }
        return endpoint;
      }),
    ).resolves.toBe(PRIMARY);
    expect(selector.active).toBe(PRIMARY);
  });

  it("gives up once every endpoint has been tried", async () => {
    const selector = new RpcEndpointSelector(PRIMARY, FALLBACK);
    const request = jest.fn(async () => {
      throw new Error("Failed to fetch");
    });

    await expect(selector.run(request)).rejects.toThrow("Failed to fetch");
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("does not rotate on an error the chain answered with", async () => {
    const selector = new RpcEndpointSelector(PRIMARY, FALLBACK);
    const request = jest.fn(async () => {
      throw new Error("insufficient funds");
    });

    await expect(selector.run(request)).rejects.toThrow("insufficient funds");
    expect(request).toHaveBeenCalledTimes(1);
    expect(selector.active).toBe(PRIMARY);
  });

  it("stays on the only endpoint when no fallback is configured", async () => {
    const selector = new RpcEndpointSelector(PRIMARY);
    const request = jest.fn(async () => {
      throw new Error("Failed to fetch");
    });

    await expect(selector.run(request)).rejects.toThrow("Failed to fetch");
    expect(request).toHaveBeenCalledTimes(1);
    expect(selector.active).toBe(PRIMARY);
  });

  it("ignores a fallback that duplicates the primary", async () => {
    const selector = new RpcEndpointSelector(PRIMARY, PRIMARY);
    const request = jest.fn(async () => {
      throw new Error("Failed to fetch");
    });

    await expect(selector.run(request)).rejects.toThrow("Failed to fetch");
    expect(request).toHaveBeenCalledTimes(1);
  });
});

describe("isTransportError", () => {
  it.each([500, 502, 503, 429])("treats HTTP %i as a dead endpoint", status => {
    expect(isTransportError(new Error(`Bad status on response: ${status}`))).toBe(true);
    expect(isTransportError(axiosErrorWithStatus(status))).toBe(true);
  });

  it.each([400, 404, 422])("treats HTTP %i as an answer from the chain", status => {
    expect(isTransportError(new Error(`Bad status on response: ${status}`))).toBe(false);
    expect(isTransportError(axiosErrorWithStatus(status))).toBe(false);
  });

  it("treats an axios error without a response as a dead endpoint", () => {
    expect(isTransportError(new AxiosError("Network Error", AxiosError.ERR_NETWORK))).toBe(true);
  });

  it("recognizes the timeout raised for a node that never answers", () => {
    expect(isTransportError(new Error(`Timed out waiting for the RPC node at ${PRIMARY}`))).toBe(true);
  });

  it("does not classify a chain-level error as a transport error", () => {
    expect(isTransportError(new Error("unknown request"))).toBe(false);
    expect(isTransportError(undefined)).toBe(false);
  });
});
