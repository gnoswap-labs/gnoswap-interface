import React from "react";
import { render, waitFor } from "@testing-library/react";

import { DexEvent } from "@repositories/common";

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
      fetchWugnotBalance: jest.fn(),
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

  it("keeps the known transaction hash on the pending snackbar", () => {
    const Probe = () => {
      const { enqueueEvent } = useTransactionEventStore();

      React.useEffect(() => {
        enqueueEvent({ txHash, action: DexEvent.SWAP });
      }, [enqueueEvent]);

      return null;
    };

    render(<Probe />);

    expect(enqueue).toHaveBeenCalledWith(
      { txHash },
      expect.objectContaining({
        type: "pending",
      }),
    );
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
