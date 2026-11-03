import { AxiosError, AxiosHeaders } from "axios";

import { JsonRpcResponseError } from "./json-rpc-response-error";
import { isTransportError, RpcEndpointSelector } from "./rpc-endpoint-selector";

const PRIMARY = "https://primary.rpc";
const FALLBACK = "https://fallback.rpc";

function unreachable(): AxiosError {
  return new AxiosError("Network Error", AxiosError.ERR_NETWORK);
}

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

/** Resolves on `endpoint`, and fails at the transport level on every other one. */
function onlyAnswering(endpoint: string) {
  return async (attempted: string) => {
    if (attempted !== endpoint) {
      throw unreachable();
    }
    return attempted;
  };
}

describe("RpcEndpointSelector", () => {
  it("rotates to the fallback and retries the same request there", async () => {
    const selector = new RpcEndpointSelector(PRIMARY, FALLBACK);
    const request = jest.fn(onlyAnswering(FALLBACK));

    await expect(selector.run(request)).resolves.toBe(FALLBACK);
    expect(request.mock.calls.map(([endpoint]) => endpoint)).toEqual([PRIMARY, FALLBACK]);
  });

  it("keeps using the fallback once it rotated, instead of paying the dead endpoint again", async () => {
    const selector = new RpcEndpointSelector(PRIMARY, FALLBACK);
    const request = jest.fn(onlyAnswering(FALLBACK));

    await selector.run(request);
    await expect(selector.run(request)).resolves.toBe(FALLBACK);

    expect(selector.active).toBe(FALLBACK);
    expect(request).toHaveBeenCalledTimes(3);
  });

  it("rotates back to the primary once the fallback stops answering", async () => {
    const selector = new RpcEndpointSelector(PRIMARY, FALLBACK);

    await selector.run(onlyAnswering(FALLBACK));

    await expect(selector.run(onlyAnswering(PRIMARY))).resolves.toBe(PRIMARY);
    expect(selector.active).toBe(PRIMARY);
  });

  it("gives up once every endpoint has been tried", async () => {
    const selector = new RpcEndpointSelector(PRIMARY, FALLBACK);
    const request = jest.fn(onlyAnswering("https://unused.rpc"));

    await expect(selector.run(request)).rejects.toBeInstanceOf(AxiosError);
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("does not rotate on an error the chain answered with", async () => {
    const selector = new RpcEndpointSelector(PRIMARY, FALLBACK);
    const request = jest.fn(async () => {
      throw new JsonRpcResponseError("insufficient funds");
    });

    await expect(selector.run(request)).rejects.toThrow("insufficient funds");
    expect(request).toHaveBeenCalledTimes(1);
    expect(selector.active).toBe(PRIMARY);
  });

  it("stays on the only endpoint when no fallback is configured", async () => {
    const selector = new RpcEndpointSelector(PRIMARY);
    const request = jest.fn(onlyAnswering(FALLBACK));

    await expect(selector.run(request)).rejects.toBeInstanceOf(AxiosError);
    expect(request).toHaveBeenCalledTimes(1);
    expect(selector.active).toBe(PRIMARY);
  });

  it("ignores a fallback that duplicates the primary", async () => {
    const selector = new RpcEndpointSelector(PRIMARY, PRIMARY);
    const request = jest.fn(onlyAnswering(FALLBACK));

    await expect(selector.run(request)).rejects.toBeInstanceOf(AxiosError);
    expect(request).toHaveBeenCalledTimes(1);
  });
});

describe("isTransportError", () => {
  it.each([500, 502, 503, 429])("treats HTTP %i as a dead endpoint", status => {
    expect(isTransportError(axiosErrorWithStatus(status))).toBe(true);
  });

  it.each([400, 404, 422])("treats HTTP %i as an answer from the chain", status => {
    expect(isTransportError(axiosErrorWithStatus(status))).toBe(false);
  });

  it("treats an axios error without a response as a dead endpoint", () => {
    expect(isTransportError(unreachable())).toBe(true);
    expect(isTransportError(new AxiosError("timeout of 10000ms exceeded", AxiosError.ECONNABORTED))).toBe(true);
  });

  it("classifies by shape, so a response error mentioning a timeout is still a response", () => {
    expect(isTransportError(new JsonRpcResponseError("upstream timeout while executing the message"))).toBe(false);
  });

  it("does not fail over on an error of an unknown kind", () => {
    expect(isTransportError(new Error("Failed to fetch"))).toBe(false);
    expect(isTransportError(undefined)).toBe(false);
  });
});
