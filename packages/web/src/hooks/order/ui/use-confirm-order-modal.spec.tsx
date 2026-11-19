import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";

import { CommonState } from "@states/index";

import { useConfirmOrderModal } from "./use-confirm-order-modal";

const renderModalOwner = () => {
  const store = createStore();
  const wrapper = ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;
  const content = <div>confirm order 7</div>;
  const hook = renderHook(() => useConfirmOrderModal(() => content), { wrapper });

  return { store, hook };
};

describe("useConfirmOrderModal", () => {
  it("closes its open confirmation when the owner unmounts", () => {
    const { store, hook } = renderModalOwner();
    act(() => hook.result.current.openModal());
    expect(store.get(CommonState.openedModal)).toBe(true);

    hook.unmount();

    expect(store.get(CommonState.openedModal)).toBe(false);
    expect(store.get(CommonState.modalContent)).toBeNull();
  });

  it("leaves a modal another flow opened since then", () => {
    const { store, hook } = renderModalOwner();
    act(() => hook.result.current.openModal());
    const other = <div>another flow</div>;
    act(() => store.set(CommonState.modalContent, other));

    hook.unmount();

    expect(store.get(CommonState.openedModal)).toBe(true);
    expect(store.get(CommonState.modalContent)).toBe(other);
  });

  it("leaves the shared modal alone when it never opened one", () => {
    const { store, hook } = renderModalOwner();
    const other = <div>another flow</div>;
    act(() => {
      store.set(CommonState.openedModal, true);
      store.set(CommonState.modalContent, other);
    });

    hook.unmount();

    expect(store.get(CommonState.openedModal)).toBe(true);
    expect(store.get(CommonState.modalContent)).toBe(other);
  });

  it("settles when the content callback changes on every render", () => {
    const store = createStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const stableContent = () => <div>confirm order 7</div>;
    let renders = 0;
    const hook = renderHook(
      () => {
        renders += 1;
        // A new callback per render, as the real order handlers pass; stabilized after a cap so a loop fails, not hangs.
        return useConfirmOrderModal(renders > 50 ? stableContent : () => <div>confirm order 7</div>);
      },
      { wrapper },
    );

    act(() => hook.result.current.openModal());

    expect(renders).toBeLessThan(10);
    expect(consoleError).not.toHaveBeenCalled();
    expect(store.get(CommonState.modalContent)).not.toBeNull();
    consoleError.mockRestore();
  });
});
