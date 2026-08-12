import React from "react";
import { render } from "@testing-library/react";

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
});
