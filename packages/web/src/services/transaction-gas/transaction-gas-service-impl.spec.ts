import { GnoProvider, SimulateTxResult } from "@common/clients/gno-provider/gno-provider";
import { WalletClient } from "@common/clients/wallet-client";
import { DEFAULT_GAS_WANTED } from "@common/values";
import { GasToken } from "@common/values/token-constant";
import { TransactionService } from "@services/transaction";
import { Document } from "src/types/transaction-messages.types";

import { OFFERED_GAS_FEE, planProbes } from "./native-amount-reserve";
import { TransactionGasServiceImpl } from "./transaction-gas-service-impl";

const GAS_PRICE = 0.001;
const RESERVE_BUFFER = 10_000;

const BALANCE = 100_000_000;

/** The amounts the policy plans to measure at, so the spec never restates them. */
const plannedFor = (balance: number) => planProbes(`${balance}`, OFFERED_GAS_FEE, DEFAULT_GAS_WANTED, GAS_PRICE);

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
    getGasPrice: jest.fn().mockResolvedValue(GAS_PRICE),
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

const result = (gasUsed: number, storageDeposit = 0): SimulateTxResult => ({ gasUsed, storageDeposit });

const request = (balance = BALANCE, makeMessages = jest.fn().mockReturnValue([{}])) => ({
  balance: `${balance}`,
  makeMessages,
});

describe("TransactionGasServiceImpl.estimateMaxNativeAmount", () => {
  it("prices the fee from the measured gas, the way the wallet re-prices it", async () => {
    // 1e9 gas x 1.5 margin x 0.001 = 1_500_000 ugnot, above the flat fee.
    const simulateTx = jest.fn().mockResolvedValue(result(1_000_000_000));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request());

    expect(max.simulated).toBe(true);
    expect(max.reserve.gasFee).toBe("1500000");
    expect(max.amount).toBe(`${BALANCE - 1_500_000 - RESERVE_BUFFER}`);
  });

  it("probes below the maximum, at the ceiling the transaction would carry", async () => {
    const makeMessages = jest.fn().mockReturnValue([{}]);
    const simulateTx = jest.fn().mockResolvedValue(result(1_000_000_000));
    const { service } = makeService(simulateTx);

    await service.estimateMaxNativeAmount(request(BALANCE, makeMessages));

    expect(makeMessages).toHaveBeenNthCalledWith(1, plannedFor(BALANCE)[0].amount);
    const [probeTx] = simulateTx.mock.calls[0];
    expect(probeTx.fee.gas_wanted).toBe(BigInt(DEFAULT_GAS_WANTED));
  });

  it("verifies the amount it arrived at", async () => {
    const makeMessages = jest.fn().mockReturnValue([{}]);
    const simulateTx = jest.fn().mockResolvedValue(result(1_000_000_000));
    const { service } = makeService(simulateTx);

    await service.estimateMaxNativeAmount(request(BALANCE, makeMessages));

    expect(makeMessages).toHaveBeenNthCalledWith(2, `${BALANCE - 1_500_000 - RESERVE_BUFFER}`);
    expect(simulateTx).toHaveBeenCalledTimes(2);
  });

  it("bisects towards the probe when verification fails, instead of trimming a share", async () => {
    const makeMessages = jest.fn().mockReturnValue([{}]);
    const simulateTx = jest
      .fn()
      .mockResolvedValueOnce(result(1_000_000_000))
      .mockRejectedValue(new Error("insufficient coins"));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request(BALANCE, makeMessages));

    const probe = Number(plannedFor(BALANCE)[0].amount);
    const first = BALANCE - 1_500_000 - RESERVE_BUFFER;
    const second = Math.floor((probe + first) / 2);

    expect(makeMessages).toHaveBeenNthCalledWith(2, `${first}`);
    expect(makeMessages).toHaveBeenNthCalledWith(3, `${second}`);
    // Falls back to the largest amount that did simulate: the probe.
    expect(max.amount).toBe(`${probe}`);
  });

  it("reports the whole amount held back, not just the measured costs", async () => {
    const simulateTx = jest
      .fn()
      .mockResolvedValueOnce(result(1_000_000_000))
      .mockRejectedValue(new Error("insufficient coins"));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request());

    expect(max.reserve.total).toBe(`${BALANCE - Number(max.amount)}`);
    expect(Number(max.reserve.buffer)).toBeGreaterThan(RESERVE_BUFFER);
  });

  it("keeps the amount under the reserve even when the probe reached higher", async () => {
    // The probe holds back a tenth of a 2 GNOT balance, less than the flat fee,
    // so the probe amount alone would not leave enough for the transaction.
    const tinyBalance = 2_000_000;
    const simulateTx = jest.fn().mockResolvedValue(result(1_000_000));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request(tinyBalance));

    expect(Number(max.amount)).toBe(tinyBalance - Number(OFFERED_GAS_FEE) - RESERVE_BUFFER);
    expect(Number(max.amount) + Number(max.reserve.total)).toBe(tinyBalance);
  });

  it("probes a balance under the offered fee at a hundredth of itself", async () => {
    // Holding back a tenth would still leave nothing for the fee, so there is
    // no ceiling to probe near.
    const smallBalance = 500_000;
    const makeMessages = jest.fn().mockReturnValue([{}]);
    const simulateTx = jest.fn().mockResolvedValue(result(140_000_000));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request(smallBalance, makeMessages));

    expect(makeMessages).toHaveBeenNthCalledWith(1, `${smallBalance / 100}`);
    expect(max.simulated).toBe(true);
  });

  it("falls back when even a hundredth of the balance cannot be simulated", async () => {
    const simulateTx = jest.fn().mockRejectedValue(new Error("no route"));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request(100_000));

    expect(max.simulated).toBe(false);
    expect(max.amount).toBe("0");
  });

  it("honours a caller that offers a different fee", async () => {
    const simulateTx = jest.fn().mockResolvedValue(result(1_000_000));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount({ ...request(), gasFee: "2500000" });

    expect(max.reserve.gasFee).toBe("2500000");
    expect(max.amount).toBe(`${BALANCE - 2_500_000 - RESERVE_BUFFER}`);
  });

  it("retries the probe with a wider hold-back when the first one cannot be afforded", async () => {
    const largeBalance = 10_000_000_000;
    const makeMessages = jest.fn().mockReturnValue([{}]);
    const simulateTx = jest.fn().mockRejectedValueOnce(new Error("insufficient coins")).mockResolvedValue(result(1_000_000_000));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request(largeBalance, makeMessages));

    const [first, retry] = plannedFor(largeBalance);
    expect(makeMessages).toHaveBeenNthCalledWith(1, first.amount);
    expect(makeMessages).toHaveBeenNthCalledWith(2, retry.amount);
    expect(max.simulated).toBe(true);
  });

  it("falls back to the offered fee when no probe can be simulated", async () => {
    const simulateTx = jest.fn().mockRejectedValue(new Error("unknown request"));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request());

    expect(max.simulated).toBe(false);
    expect(max.reserve.total).toBe(OFFERED_GAS_FEE);
    expect(max.amount).toBe(`${BALANCE - Number(OFFERED_GAS_FEE)}`);
  });

  it("falls back when the action cannot build messages for the probe amount", async () => {
    const simulateTx = jest.fn();
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request(BALANCE, jest.fn().mockReturnValue([])));

    expect(simulateTx).not.toHaveBeenCalled();
    expect(max.simulated).toBe(false);
  });

  it("falls back without simulating when the fee alone exhausts the balance", async () => {
    const simulateTx = jest.fn();
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request(1_000_000));

    expect(max.simulated).toBe(false);
    expect(max.amount).toBe("0");
  });

  it("falls back when no transaction service is available to build the document", async () => {
    const simulateTx = jest.fn();
    const { service } = makeService(simulateTx, false);

    const max = await service.estimateMaxNativeAmount(request());

    expect(simulateTx).not.toHaveBeenCalled();
    expect(max.simulated).toBe(false);
  });

  it("resolves the signing account once for every simulation", async () => {
    const simulateTx = jest.fn().mockResolvedValue(result(1_000_000_000));
    const { service, createDocument, getAccount } = makeService(simulateTx);

    await service.estimateMaxNativeAmount(request());

    expect(getAccount).toHaveBeenCalledTimes(1);
    expect(createDocument).toHaveBeenCalledTimes(2);
    expect(createDocument).toHaveBeenLastCalledWith(
      expect.objectContaining({ account: { address: "g1user", accountNumber: 7, sequence: 3 } }),
    );
  });
});
