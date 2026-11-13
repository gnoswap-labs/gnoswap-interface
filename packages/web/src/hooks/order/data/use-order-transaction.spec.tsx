import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { BROADCAST_ERROR_VALUE, DCA_BROADCAST_ERROR_VALUE } from "@common/errors/broadcast/broadcast-error";
import { DexEvent, DexEventType } from "@repositories/common";

import { useOrderTransaction } from "./use-order-transaction";

const mockEnqueueEvent = jest.fn();
const mockBroadcastError = jest.fn();

jest.mock("@hooks/common/use-transaction-event-store", () => ({
  useTransactionEventStore: () => ({ enqueueEvent: mockEnqueueEvent }),
}));
jest.mock("@hooks/common/use-message", () => ({ useMessage: () => ({ getMessage: () => ({}) }) }));
jest.mock("@hooks/common/use-transaction-confirm-modal", () => ({
  useTransactionConfirmModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@hooks/common/use-broadcast-handler", () => ({
  useBroadcastHandler: () => ({
    broadcastLoading: jest.fn(),
    broadcastSuccess: jest.fn(),
    broadcastError: mockBroadcastError,
    broadcastRejected: jest.fn(),
  }),
}));
jest.mock("@hooks/token/data/use-token-data", () => ({
  useTokenData: () => ({ updateBalances: jest.fn(), refetchGrc20Balances: jest.fn() }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

const submitAndCapture = async (action: DexEventType) => {
  mockEnqueueEvent.mockClear();
  const { result } = renderHook(() => useOrderTransaction(), { wrapper });

  act(() => {
    result.current.submit({
      action,
      messageData: { tokenASymbol: "GNOT", tokenBSymbol: "GNS", tokenAAmount: "1" },
      send: async () => ({ code: 0, type: "", status: "success", message: "", data: { hash: "tx" } }),
    });
  });
  await waitFor(() => expect(mockEnqueueEvent).toHaveBeenCalledTimes(1));

  return mockEnqueueEvent.mock.calls[0][0];
};

describe("useOrderTransaction", () => {
  it.each([DexEvent.DCA_CLAIM, DexEvent.DCA_STOP, DexEvent.LIMIT_CANCEL])(
    "checks the %s receipt for received WUGNOT, as the swap does",
    async action => {
      expect((await submitAndCapture(action)).checkWugnotTransfer).toBe(true);
    },
  );

  it.each([DexEvent.DCA_ORDER, DexEvent.LIMIT_ORDER])(
    "does not check the %s receipt, which pays nothing out",
    async action => {
      expect((await submitAndCapture(action)).checkWugnotTransfer).toBe(false);
    },
  );

  describe("failure reason", () => {
    type Send = () => Promise<WalletResponse<{ hash: string }>>;
    const submitFailure = async (action: DexEventType, send: Send) => {
      mockBroadcastError.mockClear();
      const { result } = renderHook(() => useOrderTransaction(), { wrapper });
      act(() => {
        result.current.submit({
          action,
          messageData: { tokenASymbol: "GNOT", tokenBSymbol: "GNS", tokenAAmount: "1" },
          send,
        });
      });
      await waitFor(() => expect(mockBroadcastError).toHaveBeenCalledTimes(1));
      return mockBroadcastError.mock.calls[0][0];
    };
    const failedResponse =
      (message: string): Send =>
      async () => ({
        code: 4001,
        type: "TRANSACTION_FAILED",
        status: "failure",
        message,
        data: null,
      });

    it("shows the DCA realm's reason for a failed DCA transaction", async () => {
      await expect(
        submitFailure(DexEvent.DCA_ORDER, failedResponse("[GNOSWAP-ORDER-DCA-027] missing price limit")),
      ).resolves.toBe(DCA_BROADCAST_ERROR_VALUE.PAIR_NOT_SUPPORTED);
      await expect(
        submitFailure(DexEvent.DCA_STOP, () => Promise.reject(new Error("[GNOSWAP-ORDER-DCA-021] operation halted"))),
      ).resolves.toBe(DCA_BROADCAST_ERROR_VALUE.HALTED);
    });

    it("keeps the default error for other orders", async () => {
      await expect(
        submitFailure(DexEvent.LIMIT_ORDER, failedResponse("[GNOSWAP-ORDER-DCA-004] invalid amount")),
      ).resolves.toBe(BROADCAST_ERROR_VALUE.DEFAULT);
    });
  });
});
