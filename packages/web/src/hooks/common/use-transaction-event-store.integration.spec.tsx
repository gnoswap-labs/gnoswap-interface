import { act, renderHook, waitFor } from "@testing-library/react";
import { AbciQueryResponse, Tm2Client } from "@gnolang/tm2-rpc";

import { GnoProvider } from "@common/clients/gno-provider/gno-provider";
import { TransactionEventStore } from "@common/modules/event-store/transaction-event-store";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useMessage } from "@hooks/common/use-message";
import { useSnackbar } from "@hooks/common/use-snackbar";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { DexEvent } from "@repositories/common";
import { useTransactionEventStore } from "./use-transaction-event-store";

jest.mock("@hooks/common/use-gnoswap-context", () => ({ useGnoswapContext: jest.fn() }));
jest.mock("@hooks/common/use-message", () => ({ useMessage: jest.fn() }));
jest.mock("@hooks/common/use-snackbar", () => ({ useSnackbar: jest.fn() }));
jest.mock("@hooks/wallet/data/use-wallet", () => ({ useWallet: jest.fn() }));
jest.mock("@hooks/common/use-custom-router", () => ({ __esModule: true, default: () => ({ push: jest.fn() }) }));
jest.mock("@query/common", () => ({ useGetNotifications: () => ({ refetch: jest.fn() }) }));

const txHash = "ebKeJB6fEOh9BO2MJk1+aNdPmR5BEjVBavhbb42ZL/4=";

class SnapshotProvider extends GnoProvider {
  constructor(client: Tm2Client) {
    super(client);
  }
}

function queryResponse(amount: string): AbciQueryResponse {
  return {
    responseBase: {
      data: new TextEncoder().encode(`(${amount} int64)`),
      log: "",
      info: "",
      events: [],
      error: { "@type": "", value: "" },
    },
    key: new Uint8Array(),
    value: new Uint8Array(),
    height: 0,
  };
}

function setup(amount: string, transfers = [{ fromAddress: "g1other", toAddress: "g1user", tokenAmount: "2000000" }]) {
  const enqueue = jest.fn();
  const sendUnwrapToken = jest.fn().mockResolvedValue({ code: 0 });
  const abciQuery = jest.fn().mockImplementation(async ({ height }: { height: number }) => {
    if (height === 100) return queryResponse("12000000");
    if (height === 0) return queryResponse("13000000");
    throw new Error("Requested snapshot is unavailable");
  });
  const rpcProvider = new SnapshotProvider({ abciQuery } as unknown as Tm2Client);
  const eventStore = new TransactionEventStore({
    get: jest.fn().mockResolvedValue({
      data: { result: { height: "100", tx_result: { ResponseBase: {} } } },
    }),
  });
  (useWallet as jest.Mock).mockReturnValue({ account: { address: "g1user" } });
  (useSnackbar as jest.Mock).mockReturnValue({ enqueue });
  (useMessage as jest.Mock).mockReturnValue({
    getMessage: () => ({}),
    getReceiveWugnotMessage: (_hash: string, description: string, onClick: () => void) => ({ description, onClick }),
  });
  (useGnoswapContext as jest.Mock).mockReturnValue({
    eventStore,
    rpcProvider,
    swapRouterRepository: { sendUnwrapToken },
    tokenRepository: {
      getGrc20BalancesByAddress: jest.fn().mockResolvedValue({
        data: [{ path: WRAPPED_GNOT_PATH, amount, updatedBlockHeight: 100 }],
      }),
      getGrc20TransferHistoryByTxHash: jest.fn().mockResolvedValue({ data: transfers }),
    },
  });
  const { result, unmount } = renderHook(() => useTransactionEventStore());
  return {
    enqueue,
    sendUnwrapToken,
    abciQuery,
    unmount,
    async confirm() {
      result.current.enqueueEvent({ txHash, action: DexEvent.SWAP, checkWugnotTransfer: true });
      await eventStore.updatePendingEvents();
      await eventStore.emitAllEvents(100);
    },
    receiveBadges: () => enqueue.mock.calls.filter(([, config]) => config.type === "receive-wugnot"),
  };
}

describe("unwrap guidance committed snapshots", () => {
  beforeEach(() => jest.clearAllMocks());

  it.each([
    {
      scenario: "an earlier transaction in the same block",
      amount: "10000000",
      transfers: [{ fromAddress: "g1other", toAddress: "g1user", tokenAmount: "2000000" }],
    },
    {
      scenario: "only the outgoing effect of a transaction",
      amount: "8000000",
      transfers: [
        { fromAddress: "g1user", toAddress: "g1other", tokenAmount: "2000000" },
        { fromAddress: "g1other", toAddress: "g1user", tokenAmount: "4000000" },
      ],
    },
  ])("uses the full committed balance when the API reflects $scenario", async ({ amount, transfers }) => {
    const probe = setup(amount, transfers);
    await probe.confirm();
    await waitFor(() => expect(probe.receiveBadges()).toHaveLength(1));
    const content = probe.receiveBadges()[0][0];
    expect(content.description).toBe("12");

    await content.onClick();
    expect(probe.sendUnwrapToken).toHaveBeenCalledWith(expect.objectContaining({ tokenAmount: "13" }));
  });

  it.each(["transport", "ABCI"])("does not display the API's partial amount after a %s query error", async failure => {
    const probe = setup("10000000");
    if (failure === "transport") {
      probe.abciQuery.mockRejectedValue(new Error("Requested snapshot is unavailable"));
    } else {
      const response = queryResponse("0");
      probe.abciQuery.mockResolvedValue({
        ...response,
        responseBase: {
          ...response.responseBase,
          data: new Uint8Array(),
          error: { "@type": "/std.InternalError", value: "" },
          log: "Requested snapshot is unavailable",
        },
      });
    }
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    try {
      await probe.confirm();
      await waitFor(() => expect(consoleError).toHaveBeenCalledWith(expect.any(Error)));
      expect(probe.receiveBadges()).toEqual([]);
      expect(probe.sendUnwrapToken).not.toHaveBeenCalled();
    } finally {
      consoleError.mockRestore();
    }
  });

  it("does not display guidance when unmounted while the committed balance query is pending", async () => {
    const probe = setup("10000000");
    const snapshot = Promise.withResolvers<AbciQueryResponse>();
    probe.abciQuery.mockReturnValue(snapshot.promise);
    await probe.confirm();
    await waitFor(() => expect(probe.abciQuery).toHaveBeenCalled());
    probe.unmount();
    await act(async () => {
      snapshot.resolve(queryResponse("12000000"));
    });
    expect(probe.receiveBadges()).toEqual([]);
  });
});
