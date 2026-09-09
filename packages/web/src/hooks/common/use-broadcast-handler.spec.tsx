import React from "react";
import { act, fireEvent, renderHook, screen } from "@testing-library/react";
import { createStore, Provider, useAtomValue } from "jotai";

import { BROADCAST_ERROR_VALUE } from "@common/errors/broadcast/broadcast-error";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { CommonState } from "@states/index";
import { TransactionModal } from "@states/common";
import { useBroadcastHandler } from "./use-broadcast-handler";

jest.mock("./use-snackbar", () => ({ useSnackbar: () => ({ clear: jest.fn() }) }));
jest.mock("./use-message", () => ({ useMessage: () => ({ getMessage: jest.fn() }) }));
jest.mock("./use-transaction-event-store", () => ({
  useTransactionEventStore: () => ({ enqueueEvent: jest.fn() }),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({ useWallet: () => ({ account: null }) }));
jest.mock("./use-gnoscan-url", () => ({
  useGnoscanUrl: () => ({ getTxUrl: (hash: string) => `https://scanner.test/tx/${hash}` }),
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({ i18nKey }: { i18nKey: string }) => <span>{i18nKey}</span>,
}));

function ModalContent() {
  return useAtomValue(CommonState.transactionModalContent);
}

function setup() {
  const store = createStore();
  const wrapper = ({ children }: React.PropsWithChildren) => (
    <Provider store={store}>
      <GnoswapThemeProvider>
        {children}
        <ModalContent />
      </GnoswapThemeProvider>
    </Provider>
  );
  return { store, ...renderHook(() => useBroadcastHandler(), { wrapper }) };
}

it("preserves loading text and the successful transaction link and close callback", () => {
  const { result, store } = setup();
  const callback = jest.fn();
  const open = jest.spyOn(window, "open").mockImplementation(() => null);

  act(() => result.current.broadcastLoading({ description: "Swapping <b>1 GNOT</b>" }));
  expect(screen.getByText("1 GNOT")).toBeInTheDocument();
  expect(store.get(CommonState.openedTransactionModal)).toBe(true);

  act(() => result.current.broadcastSuccess({ title: "Swap", description: "Swapped", txHash: "abc123" }, callback));
  expect(store.get(CommonState.transactionModalData)).toEqual({
    status: "success",
    title: "Swap",
    description: "Swapped",
    txHash: "abc123",
    callback,
  });
  fireEvent.click(document.querySelector(".open-link")!);
  expect(open).toHaveBeenCalledWith("https://scanner.test/tx/abc123", "_blank");
  expect(callback).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole("button", { name: "common:action.close" }));
  expect(callback).toHaveBeenCalledTimes(1);
  expect(store.get(CommonState.transactionModalData)).toBeNull();
  expect(store.get(CommonState.openedTransactionModal)).toBe(false);
  open.mockRestore();
});

it.each([undefined, ""])("does not create a success state with missing hash %s", txHash => {
  const { result, store } = setup();
  act(() => result.current.broadcastSuccess({ txHash }));
  expect(store.get(CommonState.transactionModalData)).toMatchObject({
    status: "error",
    title: BROADCAST_ERROR_VALUE.DEFAULT.title,
    description: BROADCAST_ERROR_VALUE.DEFAULT.description,
  });
});

it("replaces success data with error and rejected states and preserves callbacks", () => {
  const { result, store } = setup();
  const callback = jest.fn();
  act(() => result.current.broadcastSuccess({ txHash: "abc123" }));
  act(() => result.current.broadcastError({ type: "DEFAULT", title: "" }));
  expect(store.get(CommonState.transactionModalData)).toEqual({
    status: "error",
    title: BROADCAST_ERROR_VALUE.DEFAULT.title,
    description: BROADCAST_ERROR_VALUE.DEFAULT.description,
  });
  expect(screen.getByText(BROADCAST_ERROR_VALUE.DEFAULT.description)).toBeInTheDocument();

  act(() => result.current.broadcastRejected(undefined, callback));
  expect(store.get(CommonState.transactionModalData)).toEqual({ status: "rejected", callback });
  fireEvent.click(screen.getByRole("button", { name: "common:action.close" }));
  expect(callback).toHaveBeenCalledTimes(1);
});

it("rejects invalid state combinations at compile time", () => {
  // @ts-expect-error Success requires a transaction hash.
  const missingHash: TransactionModal = { status: "success", title: "Swap", description: "Swapped" };
  // @ts-expect-error Success cannot contain a null transaction hash.
  const nullHash: TransactionModal = { status: "success", title: "Swap", description: "Swapped", txHash: null };
  // @ts-expect-error Rejected states have no transaction hash.
  const rejectedHash: TransactionModal = { status: "rejected", txHash: "abc123" };
  // @ts-expect-error Error states require a description.
  const missingDescription: TransactionModal = { status: "error", title: "Failed" };
  expect([missingHash, nullHash, rejectedHash, missingDescription]).toHaveLength(4);
});
