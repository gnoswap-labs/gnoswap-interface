import { GnoProvider, SimulateTxResult } from "@common/clients/gno-provider/gno-provider";
import { WalletClient } from "@common/clients/wallet-client";
import { DEFAULT_GAS_WANTED } from "@common/values";
import { GasToken } from "@common/values/token-constant";
import { TransactionService } from "@services/transaction";
import { Document } from "src/types/transaction-messages.types";

import { TransactionGasServiceImpl } from "./transaction-gas-service-impl";

/** What every send path offers: DEFAULT_GAS_FEE of 1 GNOT at 6 decimals. */
const OFFERED_GAS_FEE = 1_000_000;
const RESERVE_BUFFER = 10_000;
/** Room the probe holds back: the fee, a deposit allowance, and the buffer. */
const PROBE_HEADROOM = OFFERED_GAS_FEE + 1_000_000 + RESERVE_BUFFER;

const BALANCE = 100_000_000;

const makeDocument = (): Document => ({
  msgs: [],
  fee: { amount: [{ amount: "", denom: GasToken.denom }], gas: "" },
  chain_id: "test",
  account_number: "1",
  sequence: "2",
  memo: "",
});

const makeService = (simulateTx: jest.Mock, withTransactionService = true) => {
  const rpcProvider = {
    getGasPrice: jest.fn().mockResolvedValue(0.001),
    simulateTx,
  } as unknown as GnoProvider;

  const createDocument = jest.fn().mockResolvedValue(makeDocument());
  const transactionService = { createDocument } as unknown as TransactionService;

  const getAccount = jest.fn().mockResolvedValue({
    data: { address: "g1user", accountNumber: "7", sequence: "3" },
  });
  const walletClient = { getAccount } as unknown as WalletClient;

  const service = new TransactionGasServiceImpl(
    rpcProvider,
    walletClient,
    withTransactionService ? transactionService : null,
  );

  return { service, createDocument, getAccount };
};

const result = (storageDeposit = 0, gasUsed = 1_000_000): SimulateTxResult => ({ gasUsed, storageDeposit });

const request = (balance = BALANCE, makeMessages = jest.fn().mockReturnValue([{}])) => ({
  balance: `${balance}`,
  makeMessages,
});

describe("TransactionGasServiceImpl.estimateMaxNativeAmount", () => {
  it("reserves the gas fee the transaction offers, not the gas it burns", async () => {
    // A tiny gasUsed must not shrink the reserve: the chain takes the whole
    // offered fee whether or not the gas is burned.
    const simulateTx = jest.fn().mockResolvedValue(result(0, 1));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request());

    expect(max.simulated).toBe(true);
    expect(max.reserve.gasFee).toBe(`${OFFERED_GAS_FEE}`);
    expect(max.reserve.storageDeposit).toBe("0");
    expect(max.reserve.total).toBe(`${OFFERED_GAS_FEE + RESERVE_BUFFER}`);
    expect(max.amount).toBe(`${BALANCE - OFFERED_GAS_FEE - RESERVE_BUFFER}`);
  });

  it("reserves the storage deposit the transaction would lock, padded", async () => {
    const simulateTx = jest.fn().mockResolvedValue(result(200_000));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request());

    expect(max.reserve.storageDeposit).toBe("300000");
    expect(max.reserve.total).toBe(`${OFFERED_GAS_FEE + 300_000 + RESERVE_BUFFER}`);
    expect(max.amount).toBe(`${BALANCE - OFFERED_GAS_FEE - 300_000 - RESERVE_BUFFER}`);
  });

  it("honours a caller that offers a different fee", async () => {
    const simulateTx = jest.fn().mockResolvedValue(result(0));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount({ ...request(), gasFee: "2500000" });

    expect(max.reserve.gasFee).toBe("2500000");
    expect(max.amount).toBe(`${BALANCE - 2_500_000 - RESERVE_BUFFER}`);
  });

  it("probes below the maximum, at the fee and ceiling the transaction would carry", async () => {
    const simulateTx = jest.fn().mockResolvedValue(result(0));
    const { service } = makeService(simulateTx);

    await service.estimateMaxNativeAmount(request());

    const [probeTx] = simulateTx.mock.calls[0];
    expect(probeTx.fee.gas_fee).toBe(`${OFFERED_GAS_FEE}${GasToken.denom}`);
    expect(probeTx.fee.gas_wanted).toBe(BigInt(DEFAULT_GAS_WANTED));
  });

  it("asks the caller to build the messages for the probe and then the result", async () => {
    const makeMessages = jest.fn().mockReturnValue([{}]);
    const simulateTx = jest.fn().mockResolvedValue(result(0));
    const { service } = makeService(simulateTx);

    await service.estimateMaxNativeAmount(request(BALANCE, makeMessages));

    expect(makeMessages).toHaveBeenNthCalledWith(1, `${BALANCE - PROBE_HEADROOM}`);
    expect(makeMessages).toHaveBeenNthCalledWith(2, `${BALANCE - OFFERED_GAS_FEE - RESERVE_BUFFER}`);
  });

  it("verifies the resulting amount against a second simulation", async () => {
    const simulateTx = jest.fn().mockResolvedValue(result(0));
    const { service } = makeService(simulateTx);

    await service.estimateMaxNativeAmount(request());

    expect(simulateTx).toHaveBeenCalledTimes(2);
  });

  it("accepts the probe measurement without verifying when the deposit eats the headroom", async () => {
    // A 2 GNOT deposit leaves less than the probe amount, so the measurement
    // was already taken at a larger amount than the one being offered.
    const simulateTx = jest.fn().mockResolvedValue(result(2_000_000));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request());

    expect(simulateTx).toHaveBeenCalledTimes(1);
    expect(max.reserve.storageDeposit).toBe("3000000");
    expect(max.amount).toBe(`${BALANCE - OFFERED_GAS_FEE - 3_000_000 - RESERVE_BUFFER}`);
  });

  it("never returns an unverified amount above the one the probe measured", async () => {
    const simulateTx = jest
      .fn()
      .mockResolvedValueOnce(result(0))
      .mockRejectedValue(new Error("insufficient funds to pay for fees"));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request());

    expect(max.simulated).toBe(true);
    expect(Number(max.amount)).toBeLessThanOrEqual(BALANCE - PROBE_HEADROOM);
    expect(simulateTx).toHaveBeenCalledTimes(3);
  });

  it("falls back to the offered fee when the probe cannot be simulated", async () => {
    const simulateTx = jest.fn().mockRejectedValue(new Error("unknown request"));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request());

    expect(max.simulated).toBe(false);
    expect(max.reserve.total).toBe(`${OFFERED_GAS_FEE}`);
    expect(max.amount).toBe(`${BALANCE - OFFERED_GAS_FEE}`);
  });

  it("falls back when the action cannot build messages for the probe amount", async () => {
    const simulateTx = jest.fn();
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request(BALANCE, jest.fn().mockReturnValue([])));

    expect(simulateTx).not.toHaveBeenCalled();
    expect(max.simulated).toBe(false);
  });

  it("falls back without simulating when the balance cannot cover the probe headroom", async () => {
    const simulateTx = jest.fn();
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request(1_500_000));

    expect(simulateTx).not.toHaveBeenCalled();
    expect(max.simulated).toBe(false);
    expect(max.amount).toBe(`${1_500_000 - OFFERED_GAS_FEE}`);
  });

  it("falls back when no transaction service is available to build the document", async () => {
    const simulateTx = jest.fn();
    const { service } = makeService(simulateTx, false);

    const max = await service.estimateMaxNativeAmount(request());

    expect(simulateTx).not.toHaveBeenCalled();
    expect(max.simulated).toBe(false);
  });

  it("resolves the signing account once for both simulations", async () => {
    const simulateTx = jest.fn().mockResolvedValue(result(0));
    const { service, createDocument, getAccount } = makeService(simulateTx);

    await service.estimateMaxNativeAmount(request());

    expect(getAccount).toHaveBeenCalledTimes(1);
    expect(createDocument).toHaveBeenCalledTimes(2);
    expect(createDocument).toHaveBeenLastCalledWith(
      expect.objectContaining({ account: { address: "g1user", accountNumber: 7, sequence: 3 } }),
    );
  });
});
