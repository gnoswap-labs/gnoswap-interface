import { GnoProvider, SimulateTxResult } from "@common/clients/gno-provider/gno-provider";
import { WalletClient } from "@common/clients/wallet-client";
import { GasToken } from "@common/values/token-constant";
import { TransactionService } from "@services/transaction";
import { Document } from "src/types/transaction-messages.types";

import { TransactionGasServiceImpl } from "./transaction-gas-service-impl";

const GAS_PRICE = 0.001;
const FALLBACK_RESERVE = "1000001";

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

const request = (balance: string, makeMessages = jest.fn().mockReturnValue([])) => ({
  balance,
  makeMessages,
  fallbackReserve: FALLBACK_RESERVE,
});

describe("TransactionGasServiceImpl.estimateMaxNativeAmount", () => {
  it("reserves the offered gas fee measured from the simulation", async () => {
    // 1_000_000 gas * 1.2 margin = 1_200_000 gas-wanted, priced at 1_200 ugnot.
    const simulateTx = jest.fn().mockResolvedValue(result(1_000_000));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request("100000000"));

    expect(max.simulated).toBe(true);
    expect(max.reserve.gasFee).toBe("1200");
    expect(max.reserve.storageDeposit).toBe("0");
    expect(max.reserve.total).toBe("11200");
    expect(max.amount).toBe("99988800");
  });

  it("reserves the storage deposit the transaction would lock", async () => {
    const simulateTx = jest.fn().mockResolvedValue(result(1_000_000, 200_000));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request("100000000"));

    // 200_000 ugnot locked, padded by the 1.5 multiplier.
    expect(max.reserve.storageDeposit).toBe("300000");
    expect(max.reserve.total).toBe("311200");
    expect(max.amount).toBe("99688800");
  });

  it("verifies the resulting amount against a second simulation", async () => {
    const simulateTx = jest.fn().mockResolvedValue(result(1_000_000));
    const { service } = makeService(simulateTx);

    await service.estimateMaxNativeAmount(request("100000000"));

    expect(simulateTx).toHaveBeenCalledTimes(2);
  });

  it("accepts the probe reserve without verifying when it already exceeds the fallback", async () => {
    // A 2 GNOT reserve leaves less than the probe amount, so the measurement
    // was taken at a larger amount than the one being offered.
    const simulateTx = jest.fn().mockResolvedValue(result(1_000_000_000, 500_000));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request("100000000"));

    expect(simulateTx).toHaveBeenCalledTimes(1);
    expect(max.reserve.total).toBe("1960000");
    expect(max.amount).toBe("98040000");
  });

  it("never returns an unverified amount above the one the probe measured", async () => {
    const simulateTx = jest
      .fn()
      .mockResolvedValueOnce(result(1_000_000))
      .mockRejectedValue(new Error("insufficient funds to pay for fees"));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request("100000000"));

    expect(max.simulated).toBe(true);
    // 100_000_000 - FALLBACK_RESERVE, the amount the successful probe ran at.
    expect(Number(max.amount)).toBeLessThanOrEqual(98_999_999);
    expect(simulateTx).toHaveBeenCalledTimes(3);
  });

  it("falls back to the flat reserve when the probe cannot be simulated", async () => {
    const simulateTx = jest.fn().mockRejectedValue(new Error("unknown request"));
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request("100000000"));

    expect(max.simulated).toBe(false);
    expect(max.amount).toBe("98999999");
    expect(max.reserve.total).toBe(FALLBACK_RESERVE);
  });

  it("falls back without simulating when the balance cannot cover the fallback reserve", async () => {
    const simulateTx = jest.fn();
    const { service } = makeService(simulateTx);

    const max = await service.estimateMaxNativeAmount(request("1000000"));

    expect(simulateTx).not.toHaveBeenCalled();
    expect(max.simulated).toBe(false);
    expect(max.amount).toBe("0");
  });

  it("falls back when no transaction service is available to build the document", async () => {
    const simulateTx = jest.fn();
    const { service } = makeService(simulateTx, false);

    const max = await service.estimateMaxNativeAmount(request("100000000"));

    expect(simulateTx).not.toHaveBeenCalled();
    expect(max.simulated).toBe(false);
  });

  it("simulates the probe with no fee so a nearly committed balance still runs", async () => {
    const simulateTx = jest.fn().mockResolvedValue(result(1_000_000));
    const { service } = makeService(simulateTx);

    await service.estimateMaxNativeAmount(request("100000000"));

    const [probeTx] = simulateTx.mock.calls[0];
    expect(probeTx.fee.gas_fee).toBe(`0${GasToken.denom}`);
  });

  it("resolves the signing account once for both simulations", async () => {
    const simulateTx = jest.fn().mockResolvedValue(result(1_000_000));
    const { service, createDocument, getAccount } = makeService(simulateTx);

    await service.estimateMaxNativeAmount(request("100000000"));

    expect(getAccount).toHaveBeenCalledTimes(1);
    expect(createDocument).toHaveBeenCalledTimes(2);
    expect(createDocument).toHaveBeenLastCalledWith(
      expect.objectContaining({ account: { address: "g1user", accountNumber: 7, sequence: 3 } }),
    );
  });

  it("asks the caller to build the messages for each candidate amount", async () => {
    const makeMessages = jest.fn().mockReturnValue([]);
    const simulateTx = jest.fn().mockResolvedValue(result(1_000_000));
    const { service } = makeService(simulateTx);

    await service.estimateMaxNativeAmount(request("100000000", makeMessages));

    expect(makeMessages).toHaveBeenNthCalledWith(1, "98999999");
    expect(makeMessages).toHaveBeenNthCalledWith(2, "99988800");
  });
});
