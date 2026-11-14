import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";

import { DEFAULT_SLIPPAGE } from "@constants/option.constant";

import { useSlippage } from "./use-slippage";

describe("useSlippage", () => {
  const renderWithStore = (store: ReturnType<typeof createStore>, options?: Parameters<typeof useSlippage>[0]) =>
    renderHook(() => useSlippage(options), {
      wrapper: ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>,
    });

  it("keeps the selection when another trade form mounts", () => {
    const store = createStore();
    const limit = renderWithStore(store, { resetOnMount: false });
    act(() => limit.result.current.changeSlippage(2));
    limit.unmount();

    // Limit -> DCA -> Limit: each mode remounts its form.
    renderWithStore(store, { resetOnMount: false }).unmount();
    const back = renderWithStore(store, { resetOnMount: false });

    expect(back.result.current.slippage).toBe(2);
  });

  it("still resets to the default for consumers that do not opt out", () => {
    const store = createStore();
    const swap = renderWithStore(store, { resetOnMount: false });
    act(() => swap.result.current.changeSlippage(2));

    const pool = renderWithStore(store);

    expect(pool.result.current.slippage).toBe(DEFAULT_SLIPPAGE);
  });
});
