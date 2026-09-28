import { act, renderHook } from "@testing-library/react";

import { TokenModel } from "@models/token/token-model";

import { useMaxNativeAmount } from "./use-max-native-amount";

const estimateMaxNativeAmount = jest.fn();

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

/** Resolves only once released, so the subject can move while the call is out. */
const deferredEstimate = () => {
  let release: (() => void) | undefined;
  const pending = new Promise<void>(resolve => (release = resolve));

  estimateMaxNativeAmount.mockImplementation(async () => {
    await pending;
    return { amount: "9000000", reserve: {}, simulated: true };
  });

  return () => release?.();
};

beforeEach(() => {
  estimateMaxNativeAmount.mockReset();
});

describe("useMaxNativeAmount", () => {
  it("answers with the spendable amount the service worked out", async () => {
    estimateMaxNativeAmount.mockResolvedValue({ amount: "9000000", reserve: {}, simulated: true });

    const { result } = renderHook(() => useMaxNativeAmount({ token: GNOT, amount: "" }));

    await expect(
      result.current.getMaxAmount({ balance: "10", makeMessages: jest.fn().mockReturnValue([{}]) }),
    ).resolves.toBe("9");
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
