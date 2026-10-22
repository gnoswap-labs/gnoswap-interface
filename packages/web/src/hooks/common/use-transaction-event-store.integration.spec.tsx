import { act, cleanup, renderHook } from "@testing-library/react";

import { NetworkClient } from "@common/clients/network-client";
import { MockStorageClient } from "@common/clients/storage-client/mock-storage-client";
import { TransactionEventStore } from "@common/modules/event-store/transaction-event-store";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useSnackbar } from "@hooks/common/use-snackbar";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { DexEvent, DexEventType } from "@repositories/common";
import { TokenRepositoryImpl } from "@repositories/token/token-repository-impl";
import {
  IBalancesByAddressResponse,
  IBalancesByAddressWireResponse,
} from "@repositories/token/response/balance-by-address-response";
import { useTransactionEventStore } from "./use-transaction-event-store";

jest.mock("@hooks/common/use-gnoswap-context", () => ({ useGnoswapContext: jest.fn() }));
jest.mock("@hooks/common/use-snackbar", () => ({ useSnackbar: jest.fn() }));
jest.mock("@hooks/wallet/data/use-wallet", () => ({ useWallet: jest.fn() }));
jest.mock("@hooks/common/use-custom-router", () => ({ __esModule: true, default: () => ({ push: jest.fn() }) }));
jest.mock("@query/common", () => ({ useGetNotifications: () => ({ refetch: jest.fn() }) }));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string, values?: { tokenAAmount?: string }) => values?.tokenAAmount || key }),
}));

const txHash = "ebKeJB6fEOh9BO2MJk1+aNdPmR5BEjVBavhbb42ZL/4=";
const receiptUrl = `/users/g1user/balances?txHash=${encodeURIComponent(txHash)}`;
const pending: IBalancesByAddressResponse = {
  message: "",
  data: [],
  accountBalanceApplied: false,
  balanceChanges: [],
};

function applied(amount = "12000000", delta = "2000000"): IBalancesByAddressResponse {
  return {
    message: "",
    accountBalanceApplied: true,
    balanceChanges: [{ path: WRAPPED_GNOT_PATH, amount: delta }],
    data: [{ path: WRAPPED_GNOT_PATH, amount, updatedBlockHeight: 100 }],
  };
}

function nestedApplied(amount = "12000000", delta = "2000000") {
  return {
    message: "Success",
    data: {
      applied: true,
      balances: [{ path: WRAPPED_GNOT_PATH, amount, updatedBlockHeight: 100 }],
      balanceChanges: [{ path: WRAPPED_GNOT_PATH, amount: delta }],
    },
  };
}

const nestedPending = {
  message: "Success",
  data: { applied: false, balances: [], balanceChanges: [] },
};

const legacyBalances = {
  message: "Success",
  data: [{ path: WRAPPED_GNOT_PATH, amount: "12000000" }],
};

function setup(response: IBalancesByAddressWireResponse = nestedApplied()) {
  const enqueue = jest.fn();
  const sendUnwrapToken = jest.fn().mockResolvedValue({ code: 0 });
  const evaluateExpression = jest.fn();
  const abciQuery = jest.fn();
  const get = jest.fn().mockResolvedValue({ data: response });
  const tokenRepository = new TokenRepositoryImpl({ get } as unknown as NetworkClient, new MockStorageClient("LOCAL"));
  const eventStore = new TransactionEventStore({
    get: jest.fn().mockResolvedValue({
      data: { result: { height: "100", tx_result: { ResponseBase: {} } } },
    }),
  });
  (useWallet as jest.Mock).mockReturnValue({ account: { address: "g1user" } });
  (useSnackbar as jest.Mock).mockReturnValue({ enqueue });
  (useGnoswapContext as jest.Mock).mockReturnValue({
    eventStore,
    rpcProvider: { evaluateExpression, abciQuery },
    swapRouterRepository: { sendUnwrapToken },
    tokenRepository,
  });
  const { result, unmount, rerender } = renderHook(() => useTransactionEventStore());
  return {
    get,
    sendUnwrapToken,
    unmount,
    rerender,
    eventStore,
    async confirm(failed = false, action: DexEventType = DexEvent.SWAP) {
      await act(async () => {
        result.current.enqueueEvent({ txHash, action, checkWugnotTransfer: true });
        if (failed) {
          const event = eventStore.getEvent(txHash)!;
          event.status = "FAILED";
          event.emitNumber = 100;
        } else {
          await eventStore.updatePendingEvents();
        }
        await eventStore.emitAllEvents(100);
      });
    },
    receiveBadges: () => enqueue.mock.calls.filter(([, config]) => config.type === "receive-wugnot"),
    expectNoBalanceRpc() {
      expect(evaluateExpression).not.toHaveBeenCalled();
      expect(abciQuery).not.toHaveBeenCalled();
    },
  };
}

async function advance(ms: number) {
  await act(async () => {
    await (jest as typeof jest & { advanceTimersByTimeAsync: (ms: number) => Promise<void> }).advanceTimersByTimeAsync(
      ms,
    );
  });
}

describe("unwrap guidance account-balance receipts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  it.each([
    { scenario: "an earlier positive balance in the same block", amount: "10000000" },
    { scenario: "only the outgoing half of a split transaction", amount: "8000000" },
    {
      scenario: "a nested pending receipt with an earlier positive balance",
      amount: "10000000",
      nested: true,
    },
    {
      scenario: "a nested pending receipt with only the outgoing half",
      amount: "8000000",
      nested: true,
    },
  ])("waits for a receipt despite $scenario", async ({ amount, nested }) => {
    // Defensive legacy/partial projection: even a positive row at the TX height is not proof.
    const response = nestedApplied(amount);
    response.data.applied = false;
    const probe = setup(nested ? response : { ...applied(amount), accountBalanceApplied: false, balanceChanges: [] });
    await probe.confirm();
    expect(probe.receiveBadges()).toEqual([]);
    expect(probe.get).toHaveBeenCalledWith({ url: receiptUrl });

    probe.get.mockResolvedValue({ data: nested ? nestedApplied() : applied() });
    await advance(1_200);
    expect(probe.receiveBadges()).toHaveLength(1);
    expect(probe.receiveBadges()[0][0].description).toBe("12");
    expect(probe.get.mock.calls.every(([request]) => request.url === receiptUrl)).toBe(true);
    probe.expectNoBalanceRpc();
  });

  it("uses the receipt delta for eligibility but displays the entire balance including preexisting tokens", async () => {
    const probe = setup(applied("12000000", "2000000"));
    await probe.confirm();
    expect(probe.receiveBadges()).toHaveLength(1);
    expect(probe.receiveBadges()[0][0].description).toBe("12");
    expect(probe.get).toHaveBeenCalledTimes(1);
    probe.expectNoBalanceRpc();
  });

  it.each(["-2000000", "0", "9999"])("does not offer guidance for signed raw delta %s", async delta => {
    const probe = setup(applied("12000000", delta));
    await probe.confirm();
    await advance(10_000);
    expect(probe.receiveBadges()).toEqual([]);
    expect(probe.get).toHaveBeenCalledTimes(1);
    probe.expectNoBalanceRpc();
  });

  it.each([undefined, []])(
    "does not infer a received delta from current balances when changes are %s",
    async changes => {
      const probe = setup({ ...applied(), balanceChanges: changes });
      await probe.confirm();
      expect(probe.receiveBadges()).toEqual([]);
      expect(probe.get).toHaveBeenCalledTimes(1);
    },
  );

  it("preserves the threshold and a small nonzero current balance without rounding to zero", async () => {
    const probe = setup(applied("1000", "10000"));
    await probe.confirm();
    expect(probe.receiveBadges()[0][0].description).toBe("0.001");
  });

  it.each(["zero", "missing"])("stops after an applied receipt with a %s current wrapped balance", async scenario => {
    const receipt = applied("0");
    if (scenario === "missing") receipt.data = [{ path: "another/token", amount: "1000000", updatedBlockHeight: 101 }];
    const probe = setup(receipt);
    await probe.confirm();
    probe.get.mockResolvedValue({ data: applied() });
    await advance(10_000);
    expect(probe.receiveBadges()).toEqual([]);
    expect(probe.get).toHaveBeenCalledTimes(1);
    probe.expectNoBalanceRpc();
  });

  it.each([false, undefined])(
    "expires pending/missing receipt proof (%s) without using positive balances",
    async proof => {
      const probe = setup({ ...applied(), accountBalanceApplied: proof });
      await probe.confirm();
      await advance(8_000);
      const callsAtDeadline = probe.get.mock.calls.length;
      expect(callsAtDeadline).toBeGreaterThan(1);
      probe.get.mockResolvedValue({ data: applied() });
      await advance(20_000);
      expect(probe.get).toHaveBeenCalledTimes(callsAtDeadline);
      expect(probe.receiveBadges()).toEqual([]);
      expect(probe.sendUnwrapToken).not.toHaveBeenCalled();
      probe.expectNoBalanceRpc();
    },
  );

  it("finishes a successful no-account-effect vote without ever treating its absent receipt as ready", async () => {
    const probe = setup(pending);
    await probe.confirm(false, DexEvent.VOTE);
    await advance(8_000);
    expect(probe.eventStore.hasEvent(txHash)).toBe(false);
    const callsAtDeadline = probe.get.mock.calls.length;
    expect(callsAtDeadline).toBeGreaterThan(1);
    await advance(60_000);
    expect(probe.get).toHaveBeenCalledTimes(callsAtDeadline);
    expect(probe.receiveBadges()).toEqual([]);
    expect(probe.sendUnwrapToken).not.toHaveBeenCalled();
    probe.expectNoBalanceRpc();
  });

  it("cancels a pending receipt retry on unmount", async () => {
    const probe = setup(pending);
    await probe.confirm();
    probe.unmount();
    await advance(10_000);
    expect(probe.get).toHaveBeenCalledTimes(1);
    expect(probe.receiveBadges()).toEqual([]);
  });

  it("does not show a receipt that resolves after unmount", async () => {
    const probe = setup();
    const response = Promise.withResolvers<{ data: IBalancesByAddressWireResponse }>();
    probe.get.mockReturnValue(response.promise);
    await probe.confirm();
    probe.unmount();
    await act(async () => response.resolve({ data: applied() }));
    expect(probe.receiveBadges()).toEqual([]);
    probe.expectNoBalanceRpc();
  });

  it("does not display an in-flight receipt that resolves past the pending deadline", async () => {
    const probe = setup();
    const response = Promise.withResolvers<{ data: IBalancesByAddressWireResponse }>();
    probe.get.mockReturnValue(response.promise);
    await probe.confirm();
    await advance(8_000);
    await act(async () => response.resolve({ data: applied() }));
    expect(probe.receiveBadges()).toEqual([]);
    expect(probe.get).toHaveBeenCalledTimes(1);
  });

  it("does not start a receipt check after a failed transaction", async () => {
    const probe = setup();
    await probe.confirm(true);
    expect(probe.get).not.toHaveBeenCalled();
    expect(probe.receiveBadges()).toEqual([]);
  });

  it("fails receipt query errors without a badge or an RPC fallback", async () => {
    const probe = setup();
    const error = new Error("balance receipt unavailable");
    probe.get.mockRejectedValue(error);
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    try {
      await probe.confirm();
      await advance(10_000);
      expect(consoleError).toHaveBeenCalledWith(error);
      expect(probe.receiveBadges()).toEqual([]);
      expect(probe.get).toHaveBeenCalledTimes(1);
      expect(probe.sendUnwrapToken).not.toHaveBeenCalled();
      probe.expectNoBalanceRpc();
    } finally {
      consoleError.mockRestore();
    }
  });

  it.each([
    { format: "nested", initial: nestedApplied(), refreshed: nestedApplied("13000001") },
    { format: "transitional", initial: applied(), refreshed: applied("13000001") },
  ])(
    "re-fetches the $format receipt on click and unwraps its exact full current amount",
    async ({ initial, refreshed }) => {
      const probe = setup(initial);
      await probe.confirm();
      expect(probe.receiveBadges()).toHaveLength(1);
      expect(probe.receiveBadges()[0][0].description).toBe("12");
      probe.get.mockResolvedValue({ data: refreshed });
      await probe.receiveBadges()[0][0].onClick();
      expect(probe.get).toHaveBeenCalledTimes(2);
      expect(probe.get).toHaveBeenLastCalledWith({ url: receiptUrl });
      expect(probe.sendUnwrapToken).toHaveBeenCalledWith(expect.objectContaining({ tokenAmount: "13.000001" }));
      probe.expectNoBalanceRpc();
    },
  );

  it.each([
    { scenario: "pending", receipt: pending },
    { scenario: "missing proof", receipt: { ...applied(), accountBalanceApplied: undefined } },
    { scenario: "zero current balance", receipt: applied("0") },
    { scenario: "missing current token", receipt: { ...applied(), data: [] } },
    { scenario: "nested pending", receipt: nestedPending },
    {
      scenario: "nested pending with a positive partial balance",
      receipt: {
        message: "Success",
        data: {
          applied: false,
          balances: [{ path: WRAPPED_GNOT_PATH, amount: "8000000", updatedBlockHeight: 100 }],
          balanceChanges: [{ path: WRAPPED_GNOT_PATH, amount: "2000000" }],
        },
      },
    },
    { scenario: "legacy bare balances without metadata", receipt: legacyBalances },
    { scenario: "nested zero current balance", receipt: nestedApplied("0") },
    {
      scenario: "nested missing current token",
      receipt: { message: "Success", data: { ...nestedApplied().data, balances: [] } },
    },
  ])("suppresses click submission for $scenario", async ({ receipt }) => {
    const probe = setup();
    await probe.confirm();
    probe.get.mockResolvedValue({ data: receipt });
    await probe.receiveBadges()[0][0].onClick();
    expect(probe.get).toHaveBeenLastCalledWith({ url: receiptUrl });
    expect(probe.sendUnwrapToken).not.toHaveBeenCalled();
    probe.expectNoBalanceRpc();
  });

  it("suppresses click submission after the account disconnects", async () => {
    const probe = setup();
    await probe.confirm();
    const onClick = probe.receiveBadges()[0][0].onClick;
    (useWallet as jest.Mock).mockReturnValue({ account: null });
    probe.rerender();
    await onClick();
    expect(probe.get).toHaveBeenCalledTimes(1);
    expect(probe.sendUnwrapToken).not.toHaveBeenCalled();
    probe.expectNoBalanceRpc();
  });

  it("suppresses submission if the account changes during the click receipt query", async () => {
    const probe = setup();
    await probe.confirm();
    const response = Promise.withResolvers<{ data: IBalancesByAddressWireResponse }>();
    probe.get.mockReturnValue(response.promise);
    const clicking = probe.receiveBadges()[0][0].onClick();
    (useWallet as jest.Mock).mockReturnValue({ account: { address: "g1another" } });
    probe.rerender();
    response.resolve({ data: applied() });
    await clicking;
    expect(probe.sendUnwrapToken).not.toHaveBeenCalled();
  });

  it("propagates click query errors without submitting or falling back to RPC", async () => {
    const probe = setup();
    await probe.confirm();
    const error = new Error("receipt read failed");
    probe.get.mockRejectedValue(error);
    await expect(probe.receiveBadges()[0][0].onClick()).rejects.toThrow(error);
    expect(probe.sendUnwrapToken).not.toHaveBeenCalled();
    probe.expectNoBalanceRpc();
  });

  it("never authorizes guidance from a legacy bare array with a positive ordinary balance", async () => {
    const probe = setup(legacyBalances);
    await probe.confirm();
    await advance(8_000);
    expect(probe.receiveBadges()).toEqual([]);
    expect(probe.sendUnwrapToken).not.toHaveBeenCalled();
    probe.expectNoBalanceRpc();
  });

  it.each([
    { scenario: "zero current balance", receipt: nestedApplied("0") },
    {
      scenario: "missing current token",
      receipt: { message: "Success", data: { ...nestedApplied().data, balances: [] } },
    },
    { scenario: "pending", receipt: nestedPending },
  ])("does not show nested receipt guidance for $scenario", async ({ receipt }) => {
    const probe = setup(receipt);
    await probe.confirm();
    await advance(8_000);
    expect(probe.receiveBadges()).toEqual([]);
    expect(probe.sendUnwrapToken).not.toHaveBeenCalled();
    probe.expectNoBalanceRpc();
  });
});
