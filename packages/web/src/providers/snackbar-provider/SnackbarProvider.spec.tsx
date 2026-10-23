import React, { useContext, useEffect, useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { createStore, Provider as JotaiProvider } from "jotai";
import { WalletState } from "@states/index";
import { AccountModel } from "@models/account/account-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import SnackbarProvider, { SnackbarContext } from "./SnackbarProvider";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const accountA: AccountModel = {
  status: "ACTIVE",
  address: "g1accountA",
  balances: [],
  publicKeyType: "",
  publicKeyValue: "",
  accountNumber: 0,
  sequence: 0,
  chainId: "test-chain",
  email: "",
};
it("updates the open receive badge amount and unwrap action instead of stacking another badge", () => {
  const unwrapFirst = jest.fn();
  const unwrapLatest = jest.fn();
  const store = createStore();
  store.set(WalletState.account, accountA);

  const Controls = () => {
    const { enqueue } = useContext(SnackbarContext);
    return (
      <>
        <button
          onClick={() =>
            enqueue(
              { title: "Wrapped GNOT", description: "Convert <span>1 wGNOT</span>", onClick: unwrapFirst },
              { id: 1, type: "receive-wugnot", timeout: 0, accountAddress: accountA.address },
            )
          }
        >
          first swap
        </button>
        <button
          onClick={() =>
            enqueue(
              { title: "Wrapped GNOT", description: "Convert <span>2 wGNOT</span>", onClick: unwrapLatest },
              { id: 2, type: "receive-wugnot", timeout: 0, accountAddress: accountA.address },
            )
          }
        >
          second swap
        </button>
      </>
    );
  };
  render(
    <JotaiProvider store={store}>
      <GnoswapThemeProvider>
        <SnackbarProvider>
          <Controls />
        </SnackbarProvider>
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );

  fireEvent.click(screen.getByRole("button", { name: "first swap" }));
  expect(screen.getByText("1 wGNOT")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "second swap" }));
  expect(screen.queryByText("1 wGNOT")).not.toBeInTheDocument();
  expect(screen.getAllByText("Wrapped GNOT")).toHaveLength(1);
  fireEvent.click(screen.getByText("2 wGNOT"));
  expect(unwrapLatest).toHaveBeenCalledTimes(1);
  expect(unwrapFirst).not.toHaveBeenCalled();
});

it("expires the completed UI notification after its initiating component unmounts while keeping the receive badge", () => {
  jest.useFakeTimers();
  const store = createStore();
  store.set(WalletState.account, accountA);
  const Host = ({ onComplete }: { onComplete: () => void }) => {
    const { enqueue, change } = useContext(SnackbarContext);
    useEffect(() => {
      enqueue({ txHash: "claim-tx" }, { id: 1, type: "updating", timeout: 60_000 });
      enqueue(
        { title: "Wrapped GNOT" },
        { id: 2, type: "receive-wugnot", timeout: 0, accountAddress: accountA.address },
      );
    }, [enqueue]);
    return (
      <button
        onClick={() => {
          change(1, "updating-done");
          onComplete();
        }}
      >
        complete claim
      </button>
    );
  };
  const Controls = () => {
    const [mounted, setMounted] = useState(true);
    return mounted ? <Host onComplete={() => setMounted(false)} /> : null;
  };
  try {
    render(
      <JotaiProvider store={store}>
        <GnoswapThemeProvider>
          <SnackbarProvider>
            <Controls />
          </SnackbarProvider>
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "complete claim" }));
    expect(screen.getByText("Modal:toast.updating.complete")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "complete claim" })).not.toBeInTheDocument();
    act(() => jest.advanceTimersByTime(3_000));
    act(() => jest.advanceTimersByTime(500));
    expect(screen.queryByText("Modal:toast.updating.complete")).not.toBeInTheDocument();
    expect(screen.getByText("Wrapped GNOT")).toBeInTheDocument();
  } finally {
    jest.useRealTimers();
  }
});

it.each([null, { ...accountA, address: "g1accountB" }])(
  "removes account-owned receive badges on account change without reviving them after reconnect",
  nextAccount => {
    const store = createStore();
    store.set(WalletState.account, accountA);
    const Controls = () => {
      const { enqueue } = useContext(SnackbarContext);
      return (
        <button
          onClick={() =>
            enqueue(
              { title: "Wrapped GNOT" },
              { id: 1, type: "receive-wugnot", timeout: 0, accountAddress: accountA.address },
            )
          }
        >
          receive for A
        </button>
      );
    };
    render(
      <JotaiProvider store={store}>
        <GnoswapThemeProvider>
          <SnackbarProvider>
            <Controls />
          </SnackbarProvider>
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "receive for A" }));
    expect(screen.getByText("Wrapped GNOT")).toBeInTheDocument();
    act(() => store.set(WalletState.account, nextAccount));
    expect(screen.queryByText("Wrapped GNOT")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "receive for A" }));
    expect(screen.queryByText("Wrapped GNOT")).not.toBeInTheDocument();
    act(() => store.set(WalletState.account, accountA));
    expect(screen.queryByText("Wrapped GNOT")).not.toBeInTheDocument();
  },
);
