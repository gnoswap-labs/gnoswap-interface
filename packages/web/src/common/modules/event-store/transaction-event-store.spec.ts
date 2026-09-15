import axios from "axios";

import { TransactionEventStore } from "./transaction-event-store";

const HEX_HASH = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
const BASE64_HASH = "ASNFZ4mrze8BI0VniavN7wEjRWeJq83vASNFZ4mrze8=";

describe("TransactionEventStore transaction hash encodings", () => {
  it.each([
    ["hex", HEX_HASH],
    ["prefixed uppercase hex", `0x${HEX_HASH.toUpperCase()}`],
    ["base64", BASE64_HASH],
  ])("confirms a %s transaction and emits after indexing catches up", async (_, hash) => {
    const client = axios.create({
      adapter: async config => ({
        config,
        status: 200,
        statusText: "OK",
        headers: {},
        data:
          config.url === `/tx?hash=0x${HEX_HASH}`
            ? {
                result: {
                  height: "41",
                  tx_result: {
                    ResponseBase: { Error: null, Data: btoa("(\"123\" string)\n") },
                  },
                },
              }
            : { error: { code: -32603, message: "Could not find tx result" } },
      }),
    });
    const store = new TransactionEventStore(client);
    const onUpdate = jest.fn().mockResolvedValue(undefined);
    const onEmit = jest.fn().mockResolvedValue(undefined);
    store.addEvent(hash, onUpdate, onEmit);

    await store.updatePendingEvents();

    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ id: hash, status: "SUCCESS", emitNumber: 41, data: ["123"] }),
    );
    await store.emitAllEvents(40);
    expect(onEmit).not.toHaveBeenCalled();

    await store.emitAllEvents(41);
    expect(onEmit).toHaveBeenCalledTimes(1);
    expect(onEmit).toHaveBeenCalledWith(expect.objectContaining({ id: hash, status: "SUCCESS" }));
    expect(store.hasEvent(hash)).toBe(false);
  });
});
