import React from "react";
import { act, render, waitFor } from "@testing-library/react";

import { DexEvent } from "@repositories/common";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import type { IGrc20BalanceReceiptResponse } from "@repositories/token/response/balance-by-address-response";

import { useTransactionEventStore } from "./use-transaction-event-store";

jest.mock("@hooks/common/use-snackbar", () => ({
  useSnackbar: jest.fn(),
}));

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: jest.fn(),
}));

jest.mock("@hooks/common/use-custom-router", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@hooks/common/use-message", () => ({
  useMessage: jest.fn(),
}));

jest.mock("@hooks/swap/data/use-wrap", () => ({
  useWrap: jest.fn(),
}));

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: jest.fn(),
}));

jest.mock("@query/common", () => ({
  useGetNotifications: jest.fn(),
}));

import useCustomRouter from "@hooks/common/use-custom-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useMessage } from "@hooks/common/use-message";
import { useSnackbar } from "@hooks/common/use-snackbar";
import { useWrap } from "@hooks/swap/data/use-wrap";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useGetNotifications } from "@query/common";

describe("useTransactionEventStore", () => {
  const txHash = "ebKeJB6fEOh9BO2MJk1+aNdPmR5BEjVBavhbb42ZL/4=";
  const enqueue = jest.fn();
  const eventStore = { addEvent: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();

    (useSnackbar as jest.Mock).mockReturnValue({
      hasBadgeSnackbar: false,
      enqueue,
      dequeue: jest.fn(),
      change: jest.fn(),
    });
    (useGnoswapContext as jest.Mock).mockReturnValue({
      eventStore,
      tokenRepository: {},
      poolRepository: {},
      positionRepository: {},
    });
    (useCustomRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (useMessage as jest.Mock).mockReturnValue({
      getMessage: jest.fn(),
      getReceiveWugnotMessage: jest.fn(),
      getStakePositionMessage: jest.fn(),
    });
    (useWrap as jest.Mock).mockReturnValue({
      unwrapAll: jest.fn(),
    });
    (useWallet as jest.Mock).mockReturnValue({ account: null });
    (useGetNotifications as jest.Mock).mockReturnValue({ refetch: jest.fn() });
  });

  function setupStakeEvent(getPositionById: jest.Mock) {
    (useGnoswapContext as jest.Mock).mockReturnValue({
      eventStore,
      tokenRepository: {},
      poolRepository: { getPoolDetailByPoolPath: jest.fn().mockResolvedValue({ incentivized: true }) },
      positionRepository: { getPositionById },
    });
    (useWallet as jest.Mock).mockReturnValue({ account: { address: "g1user" } });
    const getStakePositionMessage = jest.fn().mockReturnValue({ title: "Stake" });
    (useMessage as jest.Mock).mockReturnValue({
      getMessage: jest.fn().mockReturnValue({ txHash }),
      getReceiveWugnotMessage: jest.fn(),
      getStakePositionMessage,
    });
    const Probe = () => {
      const { enqueueEvent } = useTransactionEventStore();
      React.useEffect(() => {
        enqueueEvent({ txHash, action: DexEvent.ADD, checkStakePosition: true });
      }, []);
      return null;
    };
    render(<Probe />);
    return { onEmit: eventStore.addEvent.mock.calls[0][2], getStakePositionMessage };
  }
  const appliedReceipt: IGrc20BalanceReceiptResponse = {
    message: "",
    data: [{ path: WRAPPED_GNOT_PATH, amount: "20000" }],
    accountBalanceApplied: true,
    balanceChanges: [{ path: WRAPPED_GNOT_PATH, amount: "20000" }],
  };
  const pendingReceipt: IGrc20BalanceReceiptResponse = {
    message: "",
    data: [],
    accountBalanceApplied: false,
    balanceChanges: [],
  };

  function setupTransferEvent(getReceipt: jest.Mock, hasBadgeSnackbar = false) {
    (useSnackbar as jest.Mock).mockReturnValue({
      hasBadgeSnackbar,
      enqueue,
      dequeue: jest.fn(),
      change: jest.fn(),
    });
    (useGnoswapContext as jest.Mock).mockReturnValue({
      eventStore,
      tokenRepository: { getGrc20BalanceReceiptByAddress: getReceipt },
      poolRepository: {},
      positionRepository: {},
    });
    (useWallet as jest.Mock).mockReturnValue({ account: { address: "g1user" } });
    const getMessage = jest.fn().mockReturnValue({ txHash });
    const getReceiveWugnotMessage = jest.fn().mockReturnValue({ title: "Receive WuGNOT" });
    const refetchNotifications = jest.fn();
    (useMessage as jest.Mock).mockReturnValue({
      getMessage,
      getReceiveWugnotMessage,
      getStakePositionMessage: jest.fn(),
    });
    (useWrap as jest.Mock).mockReturnValue({ unwrapAll: jest.fn() });
    (useGetNotifications as jest.Mock).mockReturnValue({ refetch: refetchNotifications });
    const Probe = () => {
      const { enqueueEvent } = useTransactionEventStore();
      React.useEffect(() => {
        enqueueEvent({ txHash, action: DexEvent.SWAP, checkWugnotTransfer: true });
      }, []);
      return null;
    };
    const { unmount, rerender } = render(<Probe />);
    const setAccount = (address: string | null) => {
      (useWallet as jest.Mock).mockReturnValue({ account: address ? { address } : null });
      rerender(<Probe />);
    };
    return {
      onEmit: eventStore.addEvent.mock.calls[0][2],
      getMessage,
      getReceiveWugnotMessage,
      refetchNotifications,
      setAccount,
      unmount,
    };
  }

  it("polls until the receipt is applied and refreshes an open receive badge", async () => {
    jest.useFakeTimers();
    try {
      const getReceipt = jest.fn().mockResolvedValueOnce(pendingReceipt).mockResolvedValue(appliedReceipt);
      const { onEmit, getReceiveWugnotMessage } = setupTransferEvent(getReceipt, true);

      await onEmit({ status: "SUCCESS", data: [] });
      await Promise.resolve();
      expect(getReceipt).toHaveBeenCalledTimes(1);
      expect(getReceipt).toHaveBeenCalledWith("g1user", txHash);
      await (
        jest as typeof jest & { advanceTimersByTimeAsync: (ms: number) => Promise<void> }
      ).advanceTimersByTimeAsync(1_199);
      expect(getReceipt).toHaveBeenCalledTimes(1);
      await (
        jest as typeof jest & { advanceTimersByTimeAsync: (ms: number) => Promise<void> }
      ).advanceTimersByTimeAsync(1);

      expect(getReceipt).toHaveBeenCalledTimes(2);
      expect(getReceiveWugnotMessage).toHaveBeenCalledWith(txHash, expect.any(String), expect.any(Function));
      expect(enqueue).toHaveBeenCalledWith(
        { title: "Receive WuGNOT" },
        expect.objectContaining({ type: "receive-wugnot", timeout: 0, accountAddress: "g1user" }),
      );
    } finally {
      jest.useRealTimers();
    }
  });

  it("ignores an applied receipt that resolves after the account changes", async () => {
    const { promise: receipt, resolve } = Promise.withResolvers<IGrc20BalanceReceiptResponse>();
    const getReceipt = jest.fn().mockReturnValue(receipt);
    const { onEmit, getReceiveWugnotMessage, setAccount } = setupTransferEvent(getReceipt);

    await onEmit({ status: "SUCCESS", data: [] });
    expect(getReceipt).toHaveBeenCalledWith("g1user", txHash);
    setAccount("g1other");
    await act(async () => {
      resolve(appliedReceipt);
      await receipt;
    });

    expect(getReceipt).toHaveBeenCalledTimes(1);
    expect(getReceiveWugnotMessage).not.toHaveBeenCalled();
    expect(enqueue.mock.calls.filter(([, config]) => config.type === "receive-wugnot")).toHaveLength(0);
  });

  it("does not check an old transaction receipt after switching accounts, disconnecting, and reconnecting", async () => {
    const getReceipt = jest.fn().mockResolvedValue(appliedReceipt);
    const { onEmit, getReceiveWugnotMessage, refetchNotifications, setAccount } = setupTransferEvent(getReceipt);

    setAccount("g1other");
    setAccount(null);
    setAccount("g1user");
    await onEmit({ status: "SUCCESS", data: [] });

    expect(refetchNotifications).toHaveBeenCalledTimes(1);
    expect(getReceipt).not.toHaveBeenCalled();
    expect(getReceiveWugnotMessage).not.toHaveBeenCalled();
    expect(enqueue.mock.calls.filter(([, config]) => config.type === "receive-wugnot")).toHaveLength(0);
  });

  it("stops receipt retries after disconnecting", async () => {
    jest.useFakeTimers();
    try {
      const getReceipt = jest.fn().mockResolvedValue(pendingReceipt);
      const { onEmit, setAccount } = setupTransferEvent(getReceipt);
      await onEmit({ status: "SUCCESS", data: [] });
      await Promise.resolve();
      expect(getReceipt).toHaveBeenCalledTimes(1);

      setAccount(null);
      await (
        jest as typeof jest & { advanceTimersByTimeAsync: (ms: number) => Promise<void> }
      ).advanceTimersByTimeAsync(10_000);

      expect(getReceipt).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });
  it("uses confirmed event data for staking guidance even while the update callback is pending", async () => {
    const getPositionById = jest.fn().mockResolvedValue({ poolPath: "pool", tokenUri: "nft.svg" });
    const { onEmit, getStakePositionMessage } = setupStakeEvent(getPositionById);
    await onEmit({ status: "SUCCESS", data: ["7", "a", "b", "c"] });

    await waitFor(() =>
      expect(getStakePositionMessage).toHaveBeenCalledWith(
        "7",
        expect.any(String),
        "nft.svg",
        expect.any(Function),
        expect.any(Function),
      ),
    );
  });

  it("retries an unindexed position and empty token URI before showing its NFT", async () => {
    jest.useFakeTimers();
    try {
      const notIndexed = Object.assign(new Error("not indexed"), { isAxiosError: true, response: { status: 404 } });
      const getPositionById = jest
        .fn()
        .mockRejectedValueOnce(notIndexed)
        .mockResolvedValueOnce({ poolPath: "pool", tokenUri: "" })
        .mockResolvedValue({ poolPath: "pool", tokenUri: "nft.svg" });
      const { onEmit, getStakePositionMessage } = setupStakeEvent(getPositionById);
      const emitting = onEmit({ status: "SUCCESS", data: ["7", "a", "b", "c"] });
      await (
        jest as typeof jest & { advanceTimersByTimeAsync: (ms: number) => Promise<void> }
      ).advanceTimersByTimeAsync(1_500);
      await emitting;

      expect(getPositionById).toHaveBeenCalledTimes(3);
      expect(getStakePositionMessage).toHaveBeenCalledWith(
        "7",
        expect.any(String),
        "nft.svg",
        expect.any(Function),
        expect.any(Function),
      );
    } finally {
      jest.useRealTimers();
    }
  });

  it("keeps the staking guidance after the image retry deadline", async () => {
    jest.useFakeTimers();
    try {
      const getPositionById = jest.fn().mockResolvedValue({ poolPath: "pool", tokenUri: "" });
      const { onEmit, getStakePositionMessage } = setupStakeEvent(getPositionById);
      const emitting = onEmit({ status: "SUCCESS", data: ["7", "a", "b", "c"] });
      await (
        jest as typeof jest & { advanceTimersByTimeAsync: (ms: number) => Promise<void> }
      ).advanceTimersByTimeAsync(7_999);
      expect(getStakePositionMessage).not.toHaveBeenCalled();
      await (
        jest as typeof jest & { advanceTimersByTimeAsync: (ms: number) => Promise<void> }
      ).advanceTimersByTimeAsync(1);
      await emitting;

      expect(getStakePositionMessage).toHaveBeenCalledWith(
        "7",
        expect.any(String),
        "",
        expect.any(Function),
        expect.any(Function),
      );
      expect(enqueue).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Stake" }),
        expect.objectContaining({ type: "stake-position" }),
      );
    } finally {
      jest.useRealTimers();
    }
  });

  it("does not start another lookup when the retry deadline expires", async () => {
    jest.useFakeTimers();
    try {
      const position = { poolPath: "pool", tokenUri: "" };
      const deadline = Date.now() + 8_000;
      const getPositionById = jest.fn().mockImplementation(() => {
        if (Date.now() >= deadline) return new Promise(() => {});
        return Promise.resolve(position);
      });
      const { onEmit, getStakePositionMessage } = setupStakeEvent(getPositionById);
      await onEmit({ status: "SUCCESS", data: ["7", "a", "b", "c"] });
      await (
        jest as typeof jest & { advanceTimersByTimeAsync: (ms: number) => Promise<void> }
      ).advanceTimersByTimeAsync(7_999);
      const callsBeforeDeadline = getPositionById.mock.calls.length;
      await (
        jest as typeof jest & { advanceTimersByTimeAsync: (ms: number) => Promise<void> }
      ).advanceTimersByTimeAsync(1);

      expect(getPositionById).toHaveBeenCalledTimes(callsBeforeDeadline);
      expect(getStakePositionMessage).toHaveBeenCalledWith(
        "7",
        expect.any(String),
        "",
        expect.any(Function),
        expect.any(Function),
      );
    } finally {
      jest.useRealTimers();
    }
  });

  it("shows guidance from the saved position when an in-flight lookup reaches the deadline", async () => {
    jest.useFakeTimers();
    try {
      const position = { poolPath: "pool", tokenUri: "" };
      const getPositionById = jest
        .fn()
        .mockResolvedValueOnce(position)
        .mockImplementation((_id, timeout?: number) => {
          if (timeout === undefined) return new Promise(() => {});
          return new Promise((_, reject) =>
            setTimeout(() => reject(Object.assign(new Error("timeout"), { isAxiosError: true })), timeout),
          );
        });
      const { onEmit, getStakePositionMessage } = setupStakeEvent(getPositionById);
      await onEmit({ status: "SUCCESS", data: ["7", "a", "b", "c"] });
      await (
        jest as typeof jest & { advanceTimersByTimeAsync: (ms: number) => Promise<void> }
      ).advanceTimersByTimeAsync(8_000);

      expect(getPositionById).toHaveBeenCalledTimes(2);
      expect(getStakePositionMessage).toHaveBeenCalledWith(
        "7",
        expect.any(String),
        "",
        expect.any(Function),
        expect.any(Function),
      );
    } finally {
      jest.useRealTimers();
    }
  });
});
