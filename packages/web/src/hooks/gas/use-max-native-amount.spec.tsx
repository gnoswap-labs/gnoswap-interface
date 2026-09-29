import { act, renderHook } from "@testing-library/react";
import { useAtomValue } from "jotai";

import { TokenModel } from "@models/token/token-model";

import { useMaxNativeAmount } from "./use-max-native-amount";

const estimateMaxNativeAmount = jest.fn();

jest.mock("jotai", () => ({ ...jest.requireActual("jotai"), useAtomValue: jest.fn() }));

const connectedAs = (address: string | null) =>
  (useAtomValue as jest.Mock).mockReturnValue(address ? { address } : null);

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ transactionGasService: { estimateMaxNativeAmount } }),
  useOptionalGnoswapContext: () => ({ transactionGasService: { estimateMaxNativeAmount } }),
}));

const GNOT: TokenModel = {
  type: "Native",
  chainId: "dev.gnoswap",
  createdAt: "0001-01-01T00:00:00Z",
  name: "Gno.land",
  path: "ugnot",
  wrappedPath: "gno.land/r/demo/wugnot",
  decimals: 6,
  symbol: "GNOT",
  displaySymbol: "GNOT",
  logoURI: "",
  priceID: "ugnot",
  address: "",
};
const OTHER_GNOT: TokenModel = { ...GNOT, path: "ugnot2", symbol: "GNOT2", priceID: "ugnot2" };

/**
 * Holds every estimate open until released, one gate per call, so a test can
 * settle an earlier call while a later one is still out.
 */
const deferredEstimate = () => {
  const gates: Array<() => void> = [];

  estimateMaxNativeAmount.mockImplementation(async () => {
    await new Promise<void>(resolve => gates.push(resolve));
    return { amount: "9000000", reserve: {}, simulated: true };
  });

  const release = (index?: number) => {
    if (index === undefined) {
      gates.splice(0).forEach(open => open());
      return;
    }
    gates[index]?.();
  };

  return release;
};

beforeEach(() => {
  estimateMaxNativeAmount.mockReset();
  connectedAs("g1user");
});

describe("useMaxNativeAmount", () => {
  it("answers with the spendable amount the service worked out", async () => {
    estimateMaxNativeAmount.mockResolvedValue({ amount: "9000000", reserve: {}, simulated: true });

    const { result } = renderHook(() => useMaxNativeAmount({ token: GNOT, amount: "" }));

    await expect(
      result.current.getMaxAmount({ balance: "10", makeMessages: jest.fn().mockReturnValue([{}]) }),
    ).resolves.toBe("9");
  });

  it("offers the whole balance to stand in while the estimate is out", async () => {
    const release = deferredEstimate();

    const { result } = renderHook(() => useMaxNativeAmount({ token: GNOT, amount: "" }));

    let pending: Promise<string | null> = Promise.resolve(null);
    await act(async () => {
      pending = result.current.getMaxAmount({ balance: "1,234.5", makeMessages: jest.fn().mockReturnValue([{}]) });
    });

    // Grouping stripped, so the field can show it the way an amount is typed.
    expect(result.current.pendingBalance).toBe("1234.5");
    expect(result.current.loading).toBe(true);

    await act(async () => {
      release();
      await pending;
    });

    expect(result.current.pendingBalance).toBeNull();
  });

  it("offers nothing to stand in when no estimate is needed", async () => {
    const { result } = renderHook(() => useMaxNativeAmount({ token: GNOT, amount: "" }));

    // Without a message builder the reserve is the flat fee, answered outright.
    await act(async () => {
      await result.current.getMaxAmount({ balance: "10" });
    });

    expect(result.current.pendingBalance).toBeNull();
    expect(estimateMaxNativeAmount).not.toHaveBeenCalled();
  });

  it("withholds an answer once the field holds another token", async () => {
    const release = deferredEstimate();

    const { result, rerender } = renderHook(props => useMaxNativeAmount(props), {
      initialProps: { token: GNOT, amount: "" },
    });

    const pending = result.current.getMaxAmount({ balance: "10", makeMessages: jest.fn().mockReturnValue([{}]) });

    rerender({ token: OTHER_GNOT, amount: "" });
    await act(async () => release());

    await expect(pending).resolves.toBeNull();
  });

  it("withholds an answer once the user has typed", async () => {
    const release = deferredEstimate();

    const { result, rerender } = renderHook(props => useMaxNativeAmount(props), {
      initialProps: { token: GNOT, amount: "" },
    });

    const pending = result.current.getMaxAmount({ balance: "10", makeMessages: jest.fn().mockReturnValue([{}]) });

    rerender({ token: GNOT, amount: "1.5" });
    await act(async () => release());

    await expect(pending).resolves.toBeNull();
  });

  it("withholds an answer once the other side of the pair changed", async () => {
    // The output token never reaches the input field, but it picks the route
    // and so the gas: a light pair priced into a heavy one falls short.
    const release = deferredEstimate();

    const { result, rerender } = renderHook(props => useMaxNativeAmount(props), {
      initialProps: { token: GNOT, amount: "", dependsOn: ["gno.land/r/demo/usdc"] },
    });

    const pending = result.current.getMaxAmount({ balance: "10", makeMessages: jest.fn().mockReturnValue([{}]) });

    rerender({ token: GNOT, amount: "", dependsOn: ["gno.land/r/demo/gns"] });
    await act(async () => release());

    await expect(pending).resolves.toBeNull();
  });

  it("answers when everything it was asked about is unchanged", async () => {
    const release = deferredEstimate();

    const { result, rerender } = renderHook(props => useMaxNativeAmount(props), {
      initialProps: { token: GNOT, amount: "", dependsOn: ["gno.land/r/demo/usdc"] },
    });

    const pending = result.current.getMaxAmount({ balance: "10", makeMessages: jest.fn().mockReturnValue([{}]) });

    // A re-render with the same subject must not throw the answer away.
    rerender({ token: GNOT, amount: "", dependsOn: ["gno.land/r/demo/usdc"] });
    await act(async () => release());

    await expect(pending).resolves.toBe("9");
  });

  it("withholds an answer once another account is connected", async () => {
    const release = deferredEstimate();

    const { result, rerender } = renderHook(props => useMaxNativeAmount(props), {
      initialProps: { token: GNOT, amount: "" },
    });

    const pending = result.current.getMaxAmount({ balance: "10", makeMessages: jest.fn().mockReturnValue([{}]) });

    connectedAs("g1other");
    rerender({ token: GNOT, amount: "" });
    await act(async () => release());

    await expect(pending).resolves.toBeNull();
  });

  it("stays loading when an earlier press settles while a later one is still out", async () => {
    const release = deferredEstimate();

    const { result } = renderHook(() => useMaxNativeAmount({ token: GNOT, amount: "" }));

    const makeMessages = jest.fn().mockReturnValue([{}]);
    let first: Promise<string | null> = Promise.resolve(null);
    let second: Promise<string | null> = Promise.resolve(null);

    await act(async () => {
      first = result.current.getMaxAmount({ balance: "10", makeMessages });
      second = result.current.getMaxAmount({ balance: "10", makeMessages });
    });
    expect(result.current.loading).toBe(true);

    // Settle only the first: the button must stay disabled for the second.
    await act(async () => {
      release(0);
      await first;
    });
    expect(result.current.loading).toBe(true);

    await act(async () => {
      release(1);
      await second;
    });
    expect(result.current.loading).toBe(false);
  });

  it("withholds the earlier answer when the button is pressed again", async () => {
    const release = deferredEstimate();

    const { result } = renderHook(() => useMaxNativeAmount({ token: GNOT, amount: "" }));

    const makeMessages = jest.fn().mockReturnValue([{}]);
    const first = result.current.getMaxAmount({ balance: "10", makeMessages });
    const second = result.current.getMaxAmount({ balance: "10", makeMessages });

    await act(async () => release());

    await expect(first).resolves.toBeNull();
    await expect(second).resolves.toBe("9");
  });
});
