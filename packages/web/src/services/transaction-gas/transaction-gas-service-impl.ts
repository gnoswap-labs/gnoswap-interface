import BigNumber from "bignumber.js";

import { GnoProvider, SimulateTxResult } from "@common/clients/gno-provider/gno-provider";
import { Tx } from "@gnolang/tm2-js-client";

import {
  MaxNativeAmount,
  MaxNativeAmountRequest,
  NativeAmountReserve,
  TransactionGasService,
} from "./transaction-gas-service";
import { WalletClient } from "@common/clients/wallet-client";
import { CommonError } from "@common/errors";
import {
  DEFAULT_GAS_WANTED,
  DEFAULT_NATIVE_AMOUNT_RESERVE,
  GAS_WANTED_BUFFER_SAFE_MARGIN,
  NATIVE_AMOUNT_RESERVE_BUFFER,
  STORAGE_DEPOSIT_BUFFER_MULTIPLIER,
} from "@common/values";
import { TransactionService } from "@services/transaction";
import { CreateTransactionDocumentParameters } from "@services/transaction/request";
import { documentToDefaultTx, MINIMUM_GAS_PRICE, withGasFee } from "@utils/transaction-utils";

/**
 * The probe runs with no fee at all. The ante handler skips the deduction for a
 * zero fee and does not enforce the gas price floor while simulating, so the
 * probe survives a balance that is almost entirely committed to the amount.
 */
const PROBE_GAS_FEE = 0;

const VERIFY_ATTEMPTS = 2;
const SHRINK_MULTIPLIER = 0.995;

type TransactionAccount = NonNullable<CreateTransactionDocumentParameters["account"]>;

interface MeasuredCost {
  gasWanted: number;
  reserve: NativeAmountReserve;
}

const toUgnot = (value: BigNumber) => value.toFixed(0, BigNumber.ROUND_DOWN);

const ceilToUgnot = (value: BigNumber) => value.toFixed(0, BigNumber.ROUND_CEIL);

function makeFallbackMaxNativeAmount(balance: BigNumber, reserve: BigNumber): MaxNativeAmount {
  const total = ceilToUgnot(reserve);

  return {
    amount: toUgnot(BigNumber.maximum(balance.minus(reserve), 0)),
    reserve: { gasFee: total, storageDeposit: "0", buffer: "0", total },
    simulated: false,
  };
}

export class TransactionGasServiceImpl implements TransactionGasService {
  private rpcProvider: GnoProvider | null;
  private walletClient: WalletClient | null;
  private transactionService: TransactionService | null;

  constructor(
    rpcProvider: GnoProvider | null,
    walletClient: WalletClient | null,
    transactionService: TransactionService | null = null,
  ) {
    this.rpcProvider = rpcProvider;
    this.walletClient = walletClient;
    this.transactionService = transactionService;
  }

  public async getGasPrices(): Promise<number | null> {
    if (!this.rpcProvider) return null;

    const gasPrice = await this.rpcProvider.getGasPrice();
    if (!gasPrice) return null;

    return gasPrice;
  }

  public async estimateGas(tx: Tx): Promise<number> {
    if (!this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    // estimateGas returns a bigint since tm2-js-client v3
    return Number(await this.rpcProvider.estimateGas(tx));
  }

  public async estimateMaxNativeAmount(request: MaxNativeAmountRequest): Promise<MaxNativeAmount> {
    const { balance, makeMessages, fallbackReserve = `${DEFAULT_NATIVE_AMOUNT_RESERVE}` } = request;

    const available = BigNumber(balance);
    const fallback = makeFallbackMaxNativeAmount(available, BigNumber(fallbackReserve));

    const probeAmount = BigNumber(toUgnot(available.minus(fallbackReserve)));
    if (!this.rpcProvider || !this.transactionService || probeAmount.isLessThanOrEqualTo(0)) {
      return fallback;
    }

    try {
      const gasPrice = (await this.getGasPrices()) || MINIMUM_GAS_PRICE;
      // Resolved once so the two simulations below don't each ask the wallet.
      const account = await this.getAccountInfo();

      const probe = await this.simulate(
        toUgnot(probeAmount),
        makeMessages,
        DEFAULT_GAS_WANTED,
        PROBE_GAS_FEE,
        account,
      );
      let measured = this.measureCost(probe, gasPrice);
      let amount = BigNumber(toUgnot(available.minus(measured.reserve.total)));
      let settled = false;

      for (let attempt = 0; attempt < VERIFY_ATTEMPTS && !settled; attempt += 1) {
        // The reserve never shrinks as the amount grows, so a reserve measured
        // at the larger probe already covers this amount.
        if (amount.isLessThanOrEqualTo(probeAmount)) {
          settled = true;
          break;
        }

        try {
          const verification = await this.simulate(
            toUgnot(amount),
            makeMessages,
            measured.gasWanted,
            Number(measured.reserve.gasFee),
            account,
          );
          const verified = this.measureCost(verification, gasPrice);
          const verifiedAmount = BigNumber(toUgnot(available.minus(verified.reserve.total)));

          measured = verified;
          if (verifiedAmount.isGreaterThanOrEqualTo(amount)) {
            settled = true;
          } else {
            amount = verifiedAmount;
          }
        } catch {
          amount = BigNumber(toUgnot(amount.multipliedBy(SHRINK_MULTIPLIER)));
        }
      }

      if (!settled) {
        amount = BigNumber.minimum(amount, probeAmount);
      }

      if (amount.isLessThanOrEqualTo(0)) return fallback;

      return { amount: toUgnot(amount), reserve: measured.reserve, simulated: true };
    } catch {
      return fallback;
    }
  }

  private async simulate(
    amount: string,
    makeMessages: MaxNativeAmountRequest["makeMessages"],
    gasWanted: number,
    gasFee: number,
    account?: TransactionAccount,
  ): Promise<SimulateTxResult> {
    if (!this.rpcProvider || !this.transactionService) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const messages = await makeMessages(amount);
    const document = await this.transactionService.createDocument({ messages, memo: "", account });

    return this.rpcProvider.simulateTx(documentToDefaultTx(withGasFee(document, gasWanted, gasFee)));
  }

  private async getAccountInfo(): Promise<TransactionAccount | undefined> {
    try {
      const account = await this.walletClient?.getAccount();
      const { address, accountNumber, sequence } = account?.data ?? {};
      if (!address) return undefined;

      return { address, accountNumber: Number(accountNumber ?? 0), sequence: Number(sequence ?? 0) };
    } catch {
      return undefined;
    }
  }

  private measureCost({ gasUsed, storageDeposit }: SimulateTxResult, gasPrice: number): MeasuredCost {
    const gasWanted = BigNumber(gasUsed).multipliedBy(GAS_WANTED_BUFFER_SAFE_MARGIN);

    const gasFee = ceilToUgnot(gasWanted.multipliedBy(gasPrice));
    const deposit = ceilToUgnot(BigNumber(storageDeposit).multipliedBy(STORAGE_DEPOSIT_BUFFER_MULTIPLIER));
    const buffer = `${NATIVE_AMOUNT_RESERVE_BUFFER}`;

    return {
      gasWanted: Number(ceilToUgnot(gasWanted)),
      reserve: {
        gasFee,
        storageDeposit: deposit,
        buffer,
        total: BigNumber(gasFee).plus(deposit).plus(buffer).toFixed(0),
      },
    };
  }
}
