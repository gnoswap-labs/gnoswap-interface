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
import { IGrc20BalanceReceiptWireResponse } from "@repositories/token/response/balance-by-address-response";
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
const receiptUrl = `/users/g1user/balances/receipts?txHash=${encodeURIComponent(txHash)}`;
const pending: IGrc20BalanceReceiptWireResponse = {
  message: "Success",
  data: { applied: false, balances: [], balanceChanges: [] },
};

function applied(amount = "12000000", delta = "2000000"): IGrc20BalanceReceiptWireResponse {
  return {
    message: "Success",
    data: {
      applied: true,
      balances: [{ path: WRAPPED_GNOT_PATH, amount, updatedBlockHeight: 100 }],
      balanceChanges: [{ path: WRAPPED_GNOT_PATH, amount: delta }],
    },
  };
}

function setup(response: IGrc20BalanceReceiptWireResponse = applied()) {
  const enqueue = jest.fn();
  const sendUnwrapToken = jest.fn().mockResolvedValue({ code: 0 });
  const evaluateExpression = jest.fn();
  const abciQuery = jest.fn();
  const getAddress = jest.fn().mockResolvedValue("g1user");
  const get = jest.fn().mockResolvedValue({ data: response });
  const tokenRepository = new TokenRepositoryImpl({ get } as unknown as NetworkClient, new MockStorageClient("LOCAL"));
  const eventStore = new TransactionEventStore({
    get: jest.fn().mockResolvedValue({
      data: { result: { height: "100", tx_result: { ResponseBase: {} } } },
    }),
  });
  (useWallet as jest.Mock).mockReturnValue({ account: { address: "g1user" }, walletClient: { getAddress } });
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
    getAddress,
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
  ])("waits for a receipt despite $scenario", async ({ amount }) => {
    // Even a positive partial row at the TX height is not proof.
    const response = applied(amount);
    response.data.applied = false;
    const probe = setup(response);
    await probe.confirm();
    expect(probe.receiveBadges()).toEqual([]);
    expect(probe.get).toHaveBeenCalledWith({ url: receiptUrl });

    probe.get.mockResolvedValue({ data: applied() });
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

  it("does not infer a received delta from current balances when changes are empty", async () => {
    const receipt = applied();
    receipt.data.balanceChanges = [];
    const probe = setup(receipt);
    await probe.confirm();
    expect(probe.receiveBadges()).toEqual([]);
    expect(probe.get).toHaveBeenCalledTimes(1);
  });

  it("preserves the threshold and a small nonzero current balance without rounding to zero", async () => {
    const probe = setup(applied("1000", "10000"));
    await probe.confirm();
    expect(probe.receiveBadges()[0][0].description).toBe("0.001");
  });

  it.each(["zero", "missing"])("stops after an applied receipt with a %s current wrapped balance", async scenario => {
    const receipt = applied("0");
    if (scenario === "missing") {
      receipt.data.balances = [{ path: "another/token", amount: "1000000", updatedBlockHeight: 101 }];
    }
    const probe = setup(receipt);
    await probe.confirm();
    probe.get.mockResolvedValue({ data: applied() });
    await advance(10_000);
    expect(probe.receiveBadges()).toEqual([]);
    expect(probe.get).toHaveBeenCalledTimes(1);
    probe.expectNoBalanceRpc();
  });

  it("expires pending receipt proof without using positive balances", async () => {
    const receipt = applied();
    receipt.data.applied = false;
    const probe = setup(receipt);
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
  });

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
    const response = Promise.withResolvers<{ data: IGrc20BalanceReceiptWireResponse }>();
    probe.get.mockReturnValue(response.promise);
    await probe.confirm();
    probe.unmount();
    await act(async () => response.resolve({ data: applied() }));
    expect(probe.receiveBadges()).toEqual([]);
    probe.expectNoBalanceRpc();
  });

  it("does not display an in-flight receipt that resolves past the pending deadline", async () => {
    const probe = setup();
    const response = Promise.withResolvers<{ data: IGrc20BalanceReceiptWireResponse }>();
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

  it.each([404, 500])("fails receipt HTTP %s without a badge or any balance fallback", async status => {
    const probe = setup();
    const error = Object.assign(new Error("balance receipt unavailable"), { response: { status } });
    probe.get.mockRejectedValue(error);
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    try {
      await probe.confirm();
      await advance(10_000);
      expect(consoleError).toHaveBeenCalledWith(error);
      expect(probe.receiveBadges()).toEqual([]);
      expect(probe.get).toHaveBeenCalledTimes(1);
      expect(probe.get).toHaveBeenCalledWith({ url: receiptUrl });
      expect(probe.sendUnwrapToken).not.toHaveBeenCalled();
      probe.expectNoBalanceRpc();
    } finally {
      consoleError.mockRestore();
    }
  });

  it("re-fetches the receipt on click and unwraps its exact full current amount", async () => {
    const probe = setup(applied());
    await probe.confirm();
    expect(probe.receiveBadges()).toHaveLength(1);
    expect(probe.receiveBadges()[0][0].description).toBe("12");
    probe.get.mockResolvedValue({ data: applied("13000001") });
    await probe.receiveBadges()[0][0].onClick();
    expect(probe.get).toHaveBeenCalledTimes(2);
    expect(probe.get).toHaveBeenLastCalledWith({ url: receiptUrl });
    expect(probe.sendUnwrapToken).toHaveBeenCalledWith(expect.objectContaining({ tokenAmount: "13.000001" }));
    probe.expectNoBalanceRpc();
  });

  it.each([
    { scenario: "pending", receipt: pending },
    { scenario: "zero current balance", receipt: applied("0") },
    {
      scenario: "pending with a positive partial balance",
      receipt: {
        message: "Success",
        data: {
          applied: false,
          balances: [{ path: WRAPPED_GNOT_PATH, amount: "8000000", updatedBlockHeight: 100 }],
          balanceChanges: [{ path: WRAPPED_GNOT_PATH, amount: "2000000" }],
        },
      },
    },
    {
      scenario: "missing current token",
      receipt: { message: "Success", data: { ...applied().data, balances: [] } },
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

  it.each(["g1another", null])("suppresses an unmounted notification when the actual signer is %s", async signer => {
    const probe = setup();
    await probe.confirm();
    const onClick = probe.receiveBadges()[0][0].onClick;
    probe.unmount();
    probe.getAddress.mockResolvedValue(signer);
    await onClick();
    expect(probe.sendUnwrapToken).not.toHaveBeenCalled();
  });

  it("checks the actual signer after the receipt resolves even when the host has unmounted", async () => {
    const probe = setup();
    await probe.confirm();
    const onClick = probe.receiveBadges()[0][0].onClick;
    probe.unmount();
    const response = Promise.withResolvers<{ data: IGrc20BalanceReceiptWireResponse }>();
    probe.get.mockReturnValue(response.promise);
    const clicking = onClick();
    probe.getAddress.mockResolvedValue("g1another");
    response.resolve({ data: applied() });
    await clicking;
    expect(probe.sendUnwrapToken).not.toHaveBeenCalled();
  });

  it("still unwraps the freshly fetched amount after unmount when the actual signer matches", async () => {
    const probe = setup();
    await probe.confirm();
    const onClick = probe.receiveBadges()[0][0].onClick;
    probe.unmount();
    probe.get.mockResolvedValue({ data: applied("13000001") });
    await onClick();
    expect(probe.sendUnwrapToken).toHaveBeenCalledWith(expect.objectContaining({ tokenAmount: "13.000001" }));
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
    const response = Promise.withResolvers<{ data: IGrc20BalanceReceiptWireResponse }>();
    probe.get.mockReturnValue(response.promise);
    const clicking = probe.receiveBadges()[0][0].onClick();
    (useWallet as jest.Mock).mockReturnValue({ account: { address: "g1another" } });
    probe.rerender();
    response.resolve({ data: applied() });
    await clicking;
    expect(probe.sendUnwrapToken).not.toHaveBeenCalled();
  });

  it.each([404, 500])("propagates click HTTP %s without submitting or any balance fallback", async status => {
    const probe = setup();
    await probe.confirm();
    const error = Object.assign(new Error("receipt read failed"), { response: { status } });
    probe.get.mockRejectedValue(error);
    await expect(probe.receiveBadges()[0][0].onClick()).rejects.toThrow(error);
    expect(probe.get).toHaveBeenCalledTimes(2);
    expect(probe.get.mock.calls.every(([request]) => request.url === receiptUrl)).toBe(true);
    expect(probe.sendUnwrapToken).not.toHaveBeenCalled();
    probe.expectNoBalanceRpc();
  });

  it("suppresses click submission when the receipt is missing its applied proof", async () => {
    const probe = setup();
    await probe.confirm();
    const { balances, balanceChanges } = applied().data;
    probe.get.mockResolvedValue({ data: { message: "Success", data: { balances, balanceChanges } } });
    await probe.receiveBadges()[0][0].onClick();
    expect(probe.get).toHaveBeenCalledTimes(2);
    expect(probe.get.mock.calls.every(([request]) => request.url === receiptUrl)).toBe(true);
    expect(probe.sendUnwrapToken).not.toHaveBeenCalled();
    probe.expectNoBalanceRpc();
  });

  it("never authorizes guidance when the receipt is missing its applied proof", async () => {
    const probe = setup();
    const { balances, balanceChanges } = applied().data;
    probe.get.mockResolvedValue({ data: { message: "Success", data: { balances, balanceChanges } } });
    await probe.confirm();
    await advance(8_000);
    expect(probe.receiveBadges()).toEqual([]);
    expect(probe.sendUnwrapToken).not.toHaveBeenCalled();
    expect(probe.get.mock.calls.every(([request]) => request.url === receiptUrl)).toBe(true);
    probe.expectNoBalanceRpc();
  });
});
