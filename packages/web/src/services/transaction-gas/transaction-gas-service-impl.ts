import BigNumber from "bignumber.js";

import { GnoProvider, SimulateTxResult } from "@common/clients/gno-provider/gno-provider";
import { Tx } from "@gnolang/tm2-js-client";

import { WalletClient } from "@common/clients/wallet-client";
import { CommonError } from "@common/errors";
import {
  DEFAULT_GAS_FEE,
  DEFAULT_GAS_WANTED,
  DEFAULT_NATIVE_AMOUNT_RESERVE,
  NATIVE_AMOUNT_RESERVE_BUFFER,
  PROBE_STORAGE_DEPOSIT_ALLOWANCE,
  PROBE_STORAGE_DEPOSIT_ALLOWANCE_RATIO,
  STORAGE_DEPOSIT_BUFFER_MULTIPLIER,
} from "@common/values";
import { GasToken } from "@common/values/token-constant";
import { TransactionService } from "@services/transaction";
import { CreateTransactionDocumentParameters } from "@services/transaction/request";
import { makeRawTokenAmount } from "@utils/token-utils";
import { documentToDefaultTx, withGasFee } from "@utils/transaction-utils";
import {
  MaxNativeAmount,
  MaxNativeAmountRequest,
  NativeAmountReserve,
  TransactionGasService,
} from "./transaction-gas-service";

/**
 * The fee every send path offers, in ugnot. Derived the way
 * `generateSendTransactionParams` derives it so the two cannot drift apart.
 */
const OFFERED_GAS_FEE = makeRawTokenAmount(GasToken, DEFAULT_GAS_FEE) ?? `${DEFAULT_NATIVE_AMOUNT_RESERVE}`;

const VERIFY_ATTEMPTS = 2;
const SHRINK_MULTIPLIER = 0.995;

type TransactionAccount = NonNullable<CreateTransactionDocumentParameters["account"]>;

const toUgnot = (value: BigNumber) => value.toFixed(0, BigNumber.ROUND_DOWN);

const ceilToUgnot = (value: BigNumber) => value.toFixed(0, BigNumber.ROUND_CEIL);

/**
 * The gas fee is reserved exactly as offered; only the deposit is padded, since
 * it is the part that can grow between the probe and the final amount.
 */
function makeReserve(storageDeposit: number, gasFee: string): NativeAmountReserve {
  const deposit = ceilToUgnot(BigNumber(storageDeposit).multipliedBy(STORAGE_DEPOSIT_BUFFER_MULTIPLIER));
  const buffer = `${NATIVE_AMOUNT_RESERVE_BUFFER}`;

  return {
    gasFee,
    storageDeposit: deposit,
    buffer,
    total: BigNumber(gasFee).plus(deposit).plus(buffer).toFixed(0),
  };
}

/**
 * How much of the spendable balance to leave for the deposit while probing.
 * Proportional rather than flat: both costs fall with the amount, so holding
 * back a fixed GNOT would probe a small balance at a fraction of its ceiling
 * and measure a deposit nothing like the one the final amount incurs.
 */
function probeDepositAllowance(ceiling: BigNumber): string {
  const proportional = ceilToUgnot(ceiling.multipliedBy(PROBE_STORAGE_DEPOSIT_ALLOWANCE_RATIO));

  return BigNumber.minimum(PROBE_STORAGE_DEPOSIT_ALLOWANCE, proportional).toFixed(0);
}

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
    const { balance, makeMessages, gasWanted = DEFAULT_GAS_WANTED } = request;

    const gasFee = request.gasFee ?? OFFERED_GAS_FEE;
    // Without a measurement the fee is still certain, so it is the floor.
    const fallbackReserve = request.fallbackReserve ?? gasFee;

    const available = BigNumber(balance);
    const fallback = makeFallbackMaxNativeAmount(available, BigNumber(fallbackReserve));

    if (!this.rpcProvider || !this.transactionService) return fallback;

    // Simulating at the maximum would fail on the very costs being measured:
    // the node deducts the fee and locks the deposit against the real balance.
    // So the probe holds back the fee plus room for a deposit, which makes it a
    // transaction that could have been broadcast as it stands.
    const ceiling = available.minus(gasFee).minus(NATIVE_AMOUNT_RESERVE_BUFFER);
    const probeAmount = BigNumber(toUgnot(ceiling.minus(probeDepositAllowance(ceiling))));
    if (probeAmount.isLessThanOrEqualTo(0)) return fallback;

    try {
      // Resolved once so the simulations below don't each ask the wallet.
      const account = await this.getAccountInfo();

      const probe = await this.simulate(toUgnot(probeAmount), makeMessages, gasWanted, gasFee, account);

      let reserve = makeReserve(probe.storageDeposit, gasFee);
      let amount = BigNumber(toUgnot(available.minus(reserve.total)));
      let settled = false;

      for (let attempt = 0; attempt < VERIFY_ATTEMPTS && !settled; attempt += 1) {
        // The deposit never shrinks as the amount grows, so one measured at the
        // larger probe already covers this amount.
        if (amount.isLessThanOrEqualTo(probeAmount)) {
          settled = true;
          break;
        }

        try {
          const verification = await this.simulate(toUgnot(amount), makeMessages, gasWanted, gasFee, account);
          const verified = makeReserve(verification.storageDeposit, gasFee);
          const verifiedAmount = BigNumber(toUgnot(available.minus(verified.total)));

          reserve = verified;
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

      return { amount: toUgnot(amount), reserve, simulated: true };
    } catch {
      return fallback;
    }
  }

  private async simulate(
    amount: string,
    makeMessages: MaxNativeAmountRequest["makeMessages"],
    gasWanted: number,
    gasFee: string,
    account?: TransactionAccount,
  ): Promise<SimulateTxResult> {
    if (!this.rpcProvider || !this.transactionService) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const messages = await makeMessages(amount);
    // An action that cannot build its messages for this amount has nothing to
    // measure, so the caller's fallback reserve is the honest answer.
    if (messages.length === 0) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const document = await this.transactionService.createDocument({ messages, memo: "", account });

    return this.rpcProvider.simulateTx(documentToDefaultTx(withGasFee(document, gasWanted, Number(gasFee))));
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
}
