import BigNumber from "bignumber.js";

import { GnoProvider, SimulateTxResult } from "@common/clients/gno-provider/gno-provider";
import { Tx } from "@gnolang/tm2-js-client";

import { WalletClient } from "@common/clients/wallet-client";
import { CommonError } from "@common/errors";
import { DEFAULT_GAS_WANTED } from "@common/values";
import { TransactionService } from "@services/transaction";
import { CreateTransactionDocumentParameters } from "@services/transaction/request";
import { documentToDefaultTx, withGasFee } from "@utils/transaction-utils";
import {
  bisectToward,
  cappedSpendable,
  describeWithheld,
  fallbackMaxNativeAmount,
  gasFeeFloor,
  MINIMUM_GAS_PRICE,
  NARROW_ATTEMPTS,
  OFFERED_GAS_FEE,
  planProbes,
  priceReserve,
  ProbeStep,
  spendableUnder,
} from "./native-amount-reserve";
import {
  MaxNativeAmount,
  MaxNativeAmountRequest,
  NativeAmountReserve,
  TransactionGasService,
} from "./transaction-gas-service";

type TransactionAccount = NonNullable<CreateTransactionDocumentParameters["account"]>;

/** What one estimate needs throughout, resolved once up front. */
interface EstimateContext {
  balance: BigNumber;
  makeMessages: MaxNativeAmountRequest["makeMessages"];
  gasWanted: number;
  gasPrice: number;
  feeFloor: string;
  account?: TransactionAccount;
}

interface Measurement {
  amount: string;
  simulation: SimulateTxResult;
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

  /** Runs the process laid out in `native-amount-reserve.ts`. */
  public async estimateMaxNativeAmount(request: MaxNativeAmountRequest): Promise<MaxNativeAmount> {
    const { balance, makeMessages, gasWanted = DEFAULT_GAS_WANTED } = request;

    const offeredGasFee = request.gasFee ?? OFFERED_GAS_FEE;
    // Without a measurement the offered fee is the only certain cost.
    const fallback = fallbackMaxNativeAmount(balance, request.fallbackReserve ?? offeredGasFee);

    if (!this.rpcProvider || !this.transactionService) return fallback;

    try {
      const context: EstimateContext = {
        balance: BigNumber(balance),
        makeMessages,
        gasWanted,
        gasPrice: (await this.getGasPrices()) || MINIMUM_GAS_PRICE,
        feeFloor: gasFeeFloor(balance, offeredGasFee),
        // Resolved once so the simulations below don't each ask the wallet.
        account: await this.getAccountInfo(),
      };

      // 1-2. Measure at the first planned amount the balance can carry.
      const plan = planProbes(balance, offeredGasFee, gasWanted, context.gasPrice);
      const measured = await this.measure(context, plan);
      if (!measured) return fallback;

      // 3-4. Price the reserve, then climb toward the ceiling from there.
      const narrowed = await this.narrow(context, measured);

      // 5. Respect both the amount a simulation accepted and the priced reserve.
      const amount = cappedSpendable(context.balance, narrowed.amount, narrowed.reserve);
      if (BigNumber(amount).isLessThanOrEqualTo(0)) return fallback;

      // 6. Report what is really held back.
      return {
        amount,
        reserve: describeWithheld(context.balance, amount, narrowed.reserve),
        simulated: true,
      };
    } catch {
      return fallback;
    }
  }

  /**
   * Steps 1-2. The first planned amount that simulates, with what it measured.
   * A step the balance cannot carry after all is skipped for the next one.
   */
  private async measure(context: EstimateContext, plan: ProbeStep[]): Promise<Measurement | null> {
    for (const step of plan) {
      try {
        return { amount: step.amount, simulation: await this.simulate(context, step.amount, step.gasFee) };
      } catch {
        continue;
      }
    }

    return null;
  }

  /**
   * Steps 3-4. Climbs from the measured amount toward the ceiling the reserve
   * allows, re-pricing on each amount that simulates and bisecting back on each
   * that does not. The amount returned is always one a simulation accepted.
   */
  private async narrow(
    context: EstimateContext,
    measured: Measurement,
  ): Promise<{ amount: string; reserve: NativeAmountReserve }> {
    let accepted = measured.amount;
    let reserve = priceReserve(measured.simulation, context.gasPrice, context.feeFloor);
    let candidate = spendableUnder(context.balance, reserve);

    for (let attempt = 0; attempt < NARROW_ATTEMPTS; attempt += 1) {
      if (BigNumber(candidate).isLessThanOrEqualTo(accepted)) break;

      try {
        const simulation = await this.simulate(context, candidate, reserve.gasFee);

        reserve = priceReserve(simulation, context.gasPrice, context.feeFloor);
        accepted = candidate;
        candidate = spendableUnder(context.balance, reserve);
      } catch {
        candidate = bisectToward(accepted, candidate);
      }
    }

    return { amount: accepted, reserve };
  }

  /** Dry-runs the action's own messages for one amount. */
  private async simulate(context: EstimateContext, amount: string, gasFee: string): Promise<SimulateTxResult> {
    if (!this.rpcProvider || !this.transactionService) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const messages = await context.makeMessages(amount);
    // An action that cannot build its messages for this amount has nothing to
    // measure, so the caller's fallback reserve is the honest answer.
    if (messages.length === 0) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const document = await this.transactionService.createDocument({
      messages,
      memo: "",
      account: context.account,
    });

    return this.rpcProvider.simulateTx(documentToDefaultTx(withGasFee(document, context.gasWanted, Number(gasFee))));
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
