import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { BROADCAST_ERROR_VALUE } from "@common/errors/broadcast/broadcast-error";
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

  it("explains a Limit withdrawal halt returned after the config was read", async () => {
    mockBroadcastError.mockClear();
    const { result } = renderHook(() => useOrderTransaction(), { wrapper });
    act(() => {
      result.current.submit({
        action: DexEvent.LIMIT_CANCEL,
        messageData: { tokenASymbol: "GNOT", tokenBSymbol: "GNS", tokenAAmount: "1" },
        send: async () => ({
          code: 1,
          type: "",
          status: "error",
          message: "panic: [GNOSWAP-ORDER-LIMIT-022] operation halted || operation(withdraw)",
          data: { hash: "" },
        }),
      });
    });
    await waitFor(() =>
      expect(mockBroadcastError).toHaveBeenCalledWith(BROADCAST_ERROR_VALUE.LIMIT_WITHDRAWALS_PAUSED),
    );
  });
});
