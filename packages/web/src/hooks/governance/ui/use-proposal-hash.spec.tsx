import { act, renderHook } from "@testing-library/react";

import { parseProposalHash, useProposalHash } from "./use-proposal-hash";

const push = jest.fn();
const replace = jest.fn();
const listeners: Record<string, ((url: string) => void)[]> = {};

const on = jest.fn((event: string, handler: (url: string) => void) => {
  listeners[event] = [...(listeners[event] || []), handler];
});
const off = jest.fn((event: string, handler: (url: string) => void) => {
  listeners[event] = (listeners[event] || []).filter(item => item !== handler);
});

jest.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/governance",
    asPath: "/governance",
    push,
    replace,
    events: { on, off },
  }),
}));

const emit = (event: string, url: string) => {
  act(() => {
    (listeners[event] || []).forEach(handler => handler(url));
  });
};

const setLocationHash = (hash: string) => {
  window.history.replaceState(null, "", `/governance${hash}`);
};

describe("parseProposalHash", () => {
  it.each([
    ["#1", 1],
    ["1", 1],
    ["#42", 42],
    ["", 0],
    [undefined, 0],
    ["#0", 0],
    ["#abc", 0],
    ["#-1", 0],
    ["#1.5", 0],
  ])("parses %p into %p", (hash, expected) => {
    expect(parseProposalHash(hash)).toBe(expected);
  });
});

describe("useProposalHash", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setLocationHash("");
  });

  it("restores the selected proposal from the initial hash", () => {
    setLocationHash("#3");

    const { result } = renderHook(() => useProposalHash());

    expect(result.current.selectedProposalId).toBe(3);
  });

  it("starts without a selected proposal when the hash is empty", () => {
    const { result } = renderHook(() => useProposalHash());

    expect(result.current.selectedProposalId).toBe(0);
  });

  it("pushes the proposal hash when a proposal is selected", () => {
    const { result } = renderHook(() => useProposalHash());

    act(() => result.current.selectProposal(7));

    expect(result.current.selectedProposalId).toBe(7);
    expect(push).toHaveBeenCalledWith("/governance#7", undefined, { shallow: true, scroll: false });
  });

  it("removes the hash when the proposal is closed", () => {
    setLocationHash("#7");

    const { result } = renderHook(() => useProposalHash());

    act(() => result.current.selectProposal(0));

    expect(result.current.selectedProposalId).toBe(0);
    expect(replace).toHaveBeenCalledWith("/governance", undefined, { shallow: true, scroll: false });
  });

  it("syncs with hash changes triggered by history navigation", () => {
    const { result } = renderHook(() => useProposalHash());

    emit("hashChangeComplete", "/governance#5");
    expect(result.current.selectedProposalId).toBe(5);

    emit("hashChangeComplete", "/governance");
    expect(result.current.selectedProposalId).toBe(0);
  });

  it("syncs with route changes that move the query and the hash together", () => {
    setLocationHash("#1");

    const { result } = renderHook(() => useProposalHash());
    expect(result.current.selectedProposalId).toBe(1);

    emit("routeChangeComplete", "/governance?active=true#2");
    expect(result.current.selectedProposalId).toBe(2);

    emit("routeChangeComplete", "/governance?active=true");
    expect(result.current.selectedProposalId).toBe(0);
  });

  it("unsubscribes from router events on unmount", () => {
    const { unmount } = renderHook(() => useProposalHash());

    expect(on).toHaveBeenCalledWith("hashChangeComplete", expect.any(Function));
    expect(on).toHaveBeenCalledWith("routeChangeComplete", expect.any(Function));

    unmount();

    expect(off).toHaveBeenCalledWith("hashChangeComplete", expect.any(Function));
    expect(off).toHaveBeenCalledWith("routeChangeComplete", expect.any(Function));
    expect(listeners["hashChangeComplete"]).toHaveLength(0);
    expect(listeners["routeChangeComplete"]).toHaveLength(0);
  });
});
