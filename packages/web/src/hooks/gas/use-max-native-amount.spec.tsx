import { act, renderHook } from "@testing-library/react";
import { useAtomValue } from "jotai";

import { TokenModel } from "@models/token/token-model";

import { MaxNativeAmountParams, MaxNativeAmountSubject, useMaxNativeAmount } from "./use-max-native-amount";

const estimateMaxNativeAmount = jest.fn();
/** Set to null for a field that has nothing to simulate its messages with. */
let mockTransactionGasService: { estimateMaxNativeAmount: jest.Mock } | null = { estimateMaxNativeAmount };

jest.mock("jotai", () => ({ ...jest.requireActual("jotai"), useAtomValue: jest.fn() }));

const connectedAs = (address: string | null) =>
  (useAtomValue as jest.Mock).mockReturnValue(address ? { address } : null);

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ transactionGasService: mockTransactionGasService }),
  useOptionalGnoswapContext: () => ({ transactionGasService: mockTransactionGasService }),
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

interface Gate {
  open: () => void;
  fail: (reason: Error) => void;
}

/**
 * Holds every estimate open until released or failed, one gate per call, so a
 * test can settle an earlier call while a later one is still out.
 */
const deferredEstimate = () => {
  const gates: Gate[] = [];

  estimateMaxNativeAmount.mockImplementation(async () => {
    const { promise, resolve, reject } = Promise.withResolvers<void>();
    gates.push({ open: () => resolve(), fail: reject });
    await promise;
    return { amount: "9000000", reserve: {}, simulated: true };
  });

  /** Settles the call at `index`, or every call still out. */
  const settleGates = (index: number | undefined, how: (gate: Gate) => void) => {
    if (index === undefined) {
      gates.splice(0).forEach(how);
      return;
    }
    const gate = gates[index];
    if (gate) how(gate);
  };

  return {
    release: (index?: number) => settleGates(index, gate => gate.open()),
    fail: (index?: number) => settleGates(index, gate => gate.fail(new Error("RPC unavailable"))),
  };
};

const withMessages = (balance = "10"): MaxNativeAmountParams => ({
  balance,
  makeMessages: jest.fn().mockReturnValue([{}]),
});

/**
 * Presses MAX inside act, as a click would, and hands back the answer still to
 * come. It is wrapped so that awaiting the press does not wait the answer out.
 */
const press = async (
  result: { current: { getMaxAmount: (params: MaxNativeAmountParams) => Promise<string | null> } },
  params: MaxNativeAmountParams = withMessages(),
) => {
  let answer: Promise<string | null> = Promise.resolve(null);
  await act(async () => {
    answer = result.current.getMaxAmount(params);
  });
  return { answer };
};

/** Lets `settle` go and waits the answer out inside act, so whatever it sets is flushed. */
const answerOf = async (
  answer: Promise<string | null>,
  settle: () => void = () => undefined,
): Promise<string | null> => {
  let value: string | null = null;
  await act(async () => {
    settle();
    value = await answer;
  });
  return value;
};

beforeEach(() => {
  estimateMaxNativeAmount.mockReset();
  mockTransactionGasService = { estimateMaxNativeAmount };
  connectedAs("g1user");
});

describe("useMaxNativeAmount", () => {
  it("answers with the spendable amount the service worked out", async () => {
    estimateMaxNativeAmount.mockResolvedValue({ amount: "9000000", reserve: {}, simulated: true });
    const { result } = renderHook(() => useMaxNativeAmount({ token: GNOT, amount: "" }));

    const { answer } = await press(result);

    await expect(answerOf(answer)).resolves.toBe("9");
    expect(result.current.failed).toBe(false);
  });

  it("returns zero and exposes failure when a positive amount was not simulated", async () => {
    estimateMaxNativeAmount.mockResolvedValue({ amount: "99000000", reserve: {}, simulated: false });
    const { result, rerender } = renderHook(props => useMaxNativeAmount(props), {
      initialProps: { token: GNOT, amount: "" },
    });

    const { answer } = await press(result, withMessages("100"));

    await expect(answerOf(answer)).resolves.toBe("0");
    expect(result.current.failed).toBe(true);

    // The caller applies the failure answer to its field; that must not hide the failure.
    rerender({ token: GNOT, amount: "0" });
    expect(result.current.failed).toBe(true);
  });

  it("clears the spendable amount and exposes failure when the current estimate rejects", async () => {
    estimateMaxNativeAmount.mockRejectedValue(new Error("RPC unavailable"));
    const { result } = renderHook(() => useMaxNativeAmount({ token: GNOT, amount: "9" }));

    const { answer } = await press(result);

    await expect(answerOf(answer)).resolves.toBe("0");
    expect(result.current.failed).toBe(true);
    expect(result.current.loading).toBe(false);
  });

  it("offers nothing and exposes failure when there is no service to simulate the messages with", async () => {
    mockTransactionGasService = null;
    const { result } = renderHook(() => useMaxNativeAmount({ token: GNOT, amount: "9" }));

    const { answer } = await press(result);

    // Holding back the fee alone would leave the action's deposit unpriced.
    await expect(answerOf(answer)).resolves.toBe("0");
    expect(result.current.failed).toBe(true);
  });

  it("still holds back just the flat fee when there is no service and no messages to build", async () => {
    mockTransactionGasService = null;
    const { result } = renderHook(() => useMaxNativeAmount({ token: GNOT, amount: "" }));

    const { answer } = await press(result, { balance: "10" });

    await expect(answerOf(answer)).resolves.toBe("9");
    expect(result.current.failed).toBe(false);
  });

  it("offers the full balance for a non-native token without exposing failure", async () => {
    const token: TokenModel = { ...GNOT, type: "GRC20" };
    const { result } = renderHook(() => useMaxNativeAmount({ token, amount: "" }));

    const { answer } = await press(result, withMessages("10"));

    await expect(answerOf(answer)).resolves.toBe("10");
    expect(result.current.failed).toBe(false);
    expect(estimateMaxNativeAmount).not.toHaveBeenCalled();
  });

  it.each([
    { reason: "a reserve that takes the whole balance", simulated: true },
    { reason: "a balance too small to simulate", simulated: false },
  ])("offers zero for $reason without calling it a failure", async ({ simulated }) => {
    estimateMaxNativeAmount.mockResolvedValue({ amount: "0", reserve: {}, simulated });
    const { result } = renderHook(() => useMaxNativeAmount({ token: GNOT, amount: "" }));

    const { answer } = await press(result);

    await expect(answerOf(answer)).resolves.toBe("0");
    expect(result.current.failed).toBe(false);
  });

  it("clears failure for a retry and returns the successful amount", async () => {
    estimateMaxNativeAmount
      .mockRejectedValueOnce(new Error("RPC unavailable"))
      .mockResolvedValueOnce({ amount: "9000000", reserve: {}, simulated: true });
    const { result, rerender } = renderHook(props => useMaxNativeAmount(props), {
      initialProps: { token: GNOT, amount: "5" },
    });

    const failed = await press(result);
    await expect(answerOf(failed.answer)).resolves.toBe("0");
    expect(result.current.failed).toBe(true);

    // The caller applies the failure answer to its field before retrying.
    rerender({ token: GNOT, amount: "0" });
    expect(result.current.failed).toBe(true);

    const retried = await press(result);
    expect(result.current.failed).toBe(false);

    await expect(answerOf(retried.answer)).resolves.toBe("9");
    rerender({ token: GNOT, amount: "9" });
    expect(result.current.failed).toBe(false);
  });

  it("clears a displayed failure when resetError is called", async () => {
    estimateMaxNativeAmount.mockRejectedValue(new Error("RPC unavailable"));
    const { result } = renderHook(() => useMaxNativeAmount({ token: GNOT, amount: "5" }));

    const { answer } = await press(result);
    await answerOf(answer);
    expect(result.current.failed).toBe(true);

    act(() => result.current.resetError());

    expect(result.current.failed).toBe(false);
  });

  it("resetError invalidates an in-flight estimate even when the field value is unchanged", async () => {
    const { release } = deferredEstimate();
    const { result, rerender } = renderHook(props => useMaxNativeAmount(props), {
      initialProps: { token: GNOT, amount: "3" },
    });

    const pending = await press(result);
    expect(result.current.loading).toBe(true);

    act(() => result.current.resetError());
    rerender({ token: GNOT, amount: "3" });
    expect(result.current.pendingBalance).toBeNull();

    await expect(answerOf(pending.answer, release)).resolves.toBeNull();
    expect(result.current.failed).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it.each([
    { change: "the user typed", movedOn: { token: GNOT, amount: "1.5" }, signer: "g1user" },
    { change: "the field holds another token", movedOn: { token: OTHER_GNOT, amount: "0" }, signer: "g1user" },
    { change: "another account is connected", movedOn: { token: GNOT, amount: "0" }, signer: "g1other" },
  ])("ignores a failed estimate once $change", async ({ movedOn, signer }) => {
    const { fail } = deferredEstimate();
    const { result, rerender } = renderHook(props => useMaxNativeAmount(props), {
      initialProps: { token: GNOT, amount: "" },
    });

    const { answer } = await press(result);
    connectedAs(signer);
    rerender(movedOn);

    // Null leaves the field as the user now has it, rather than clearing it.
    await expect(answerOf(answer, () => fail())).resolves.toBeNull();
    expect(result.current.failed).toBe(false);
  });

  it.each([
    {
      change: "the amount changes",
      movedOn: { token: GNOT, amount: "1", dependsOn: ["10", "pool-a"] },
      signer: "g1user",
    },
    {
      change: "the token changes",
      movedOn: { token: OTHER_GNOT, amount: "0", dependsOn: ["10", "pool-a"] },
      signer: "g1user",
    },
    {
      change: "the account changes",
      movedOn: { token: GNOT, amount: "0", dependsOn: ["10", "pool-a"] },
      signer: "g1other",
    },
    {
      change: "the transaction terms change",
      movedOn: { token: GNOT, amount: "0", dependsOn: ["10", "pool-b"] },
      signer: "g1user",
    },
    {
      change: "the available balance changes",
      movedOn: { token: GNOT, amount: "0", dependsOn: ["11", "pool-a"] },
      signer: "g1user",
    },
  ])("clears a settled failure when $change", async ({ movedOn, signer }) => {
    estimateMaxNativeAmount.mockRejectedValue(new Error("RPC unavailable"));
    const initialSubject: MaxNativeAmountSubject = {
      token: GNOT,
      amount: "5",
      dependsOn: ["10", "pool-a"],
    };
    const { result, rerender } = renderHook(props => useMaxNativeAmount(props), {
      initialProps: initialSubject,
    });

    const { answer } = await press(result, withMessages("10"));
    await expect(answerOf(answer)).resolves.toBe("0");
    expect(result.current.failed).toBe(true);

    // Applying the failure result is not a request change.
    rerender({ ...initialSubject, amount: "0" });
    expect(result.current.failed).toBe(true);

    connectedAs(signer);
    rerender(movedOn);
    expect(result.current.failed).toBe(false);

    connectedAs("g1user");
    rerender({ ...initialSubject, amount: "0" });
    expect(result.current.failed).toBe(false);
  });

  it("does not expose failure for a failed press that a later one superseded", async () => {
    const { release, fail } = deferredEstimate();
    const { result } = renderHook(() => useMaxNativeAmount({ token: GNOT, amount: "" }));

    const first = await press(result);
    const second = await press(result);

    await expect(answerOf(first.answer, () => fail(0))).resolves.toBeNull();
    expect(result.current.failed).toBe(false);
    await expect(answerOf(second.answer, () => release(1))).resolves.toBe("9");
    expect(result.current.failed).toBe(false);
  });

  it("withholds an answer once the field is gone", async () => {
    const { fail } = deferredEstimate();
    const { result, unmount } = renderHook(() => useMaxNativeAmount({ token: GNOT, amount: "" }));

    const { answer } = await press(result);
    unmount();

    await expect(answerOf(answer, () => fail())).resolves.toBeNull();
  });

  it("offers the whole balance to stand in while the estimate is out", async () => {
    const { release } = deferredEstimate();
    const { result } = renderHook(() => useMaxNativeAmount({ token: GNOT, amount: "" }));

    const { answer } = await press(result, withMessages("1,234.5"));

    // Grouping stripped, so the field can show it the way an amount is typed.
    expect(result.current.pendingBalance).toBe("1234.5");
    expect(result.current.loading).toBe(true);

    await answerOf(answer, release);

    expect(result.current.pendingBalance).toBeNull();
  });

  it("offers nothing to stand in when no estimate is needed", async () => {
    const { result } = renderHook(() => useMaxNativeAmount({ token: GNOT, amount: "" }));

    // Without a message builder the reserve is the flat fee, answered outright.
    const { answer } = await press(result, { balance: "10" });
    await answerOf(answer);

    expect(result.current.pendingBalance).toBeNull();
    expect(estimateMaxNativeAmount).not.toHaveBeenCalled();
  });

  it("gives the field back at once when it moves on, without waiting the estimate out", async () => {
    const { release } = deferredEstimate();
    const { result, rerender } = renderHook(props => useMaxNativeAmount(props), {
      initialProps: { token: GNOT, amount: "" },
    });

    const { answer } = await press(result);
    expect(result.current.pendingBalance).toBe("10");

    // The estimate is still out; the field is now another token's.
    rerender({ token: OTHER_GNOT, amount: "" });

    expect(result.current.pendingBalance).toBeNull();
    expect(result.current.loading).toBe(false);

    await answerOf(answer, release);
  });

  it("withholds an answer once the field holds another token", async () => {
    const { release } = deferredEstimate();
    const { result, rerender } = renderHook(props => useMaxNativeAmount(props), {
      initialProps: { token: GNOT, amount: "" },
    });

    const { answer } = await press(result);
    rerender({ token: OTHER_GNOT, amount: "" });

    await expect(answerOf(answer, release)).resolves.toBeNull();
  });

  it("withholds an answer once the user has typed", async () => {
    const { release } = deferredEstimate();
    const { result, rerender } = renderHook(props => useMaxNativeAmount(props), {
      initialProps: { token: GNOT, amount: "" },
    });

    const { answer } = await press(result);
    rerender({ token: GNOT, amount: "1.5" });

    await expect(answerOf(answer, release)).resolves.toBeNull();
  });

  it("withholds an answer once the other side of the pair changed", async () => {
    // The output token never reaches the input field, but it picks the route
    // and so the gas: a light pair priced into a heavy one falls short.
    const { release } = deferredEstimate();
    const { result, rerender } = renderHook(props => useMaxNativeAmount(props), {
      initialProps: { token: GNOT, amount: "", dependsOn: ["gno.land/r/demo/usdc"] },
    });

    const { answer } = await press(result);
    rerender({ token: GNOT, amount: "", dependsOn: ["gno.land/r/demo/gns"] });

    await expect(answerOf(answer, release)).resolves.toBeNull();
  });

  it("answers when everything it was asked about is unchanged", async () => {
    const { release } = deferredEstimate();
    const { result, rerender } = renderHook(props => useMaxNativeAmount(props), {
      initialProps: { token: GNOT, amount: "", dependsOn: ["gno.land/r/demo/usdc"] },
    });

    const { answer } = await press(result);
    // A re-render with the same subject must not throw the answer away.
    rerender({ token: GNOT, amount: "", dependsOn: ["gno.land/r/demo/usdc"] });

    await expect(answerOf(answer, release)).resolves.toBe("9");
  });

  it("withholds an answer once another account is connected", async () => {
    const { release } = deferredEstimate();
    const { result, rerender } = renderHook(props => useMaxNativeAmount(props), {
      initialProps: { token: GNOT, amount: "" },
    });

    const { answer } = await press(result);
    connectedAs("g1other");
    rerender({ token: GNOT, amount: "" });

    await expect(answerOf(answer, release)).resolves.toBeNull();
  });

  it("stays loading when an earlier press settles while a later one is still out", async () => {
    const { release } = deferredEstimate();
    const { result } = renderHook(() => useMaxNativeAmount({ token: GNOT, amount: "" }));

    const first = await press(result);
    const second = await press(result);
    expect(result.current.loading).toBe(true);

    // Settle only the first: the button must stay disabled for the second.
    await answerOf(first.answer, () => release(0));
    expect(result.current.loading).toBe(true);

    await answerOf(second.answer, () => release(1));
    expect(result.current.loading).toBe(false);
  });

  it("withholds the earlier answer when the button is pressed again", async () => {
    const { release } = deferredEstimate();
    const { result } = renderHook(() => useMaxNativeAmount({ token: GNOT, amount: "" }));

    const first = await press(result);
    const second = await press(result);

    await expect(answerOf(first.answer, release)).resolves.toBeNull();
    await expect(answerOf(second.answer)).resolves.toBe("9");
  });
});
