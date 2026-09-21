import BigNumber from "bignumber.js";

import { GnoProvider, SimulateTxResult } from "@common/clients/gno-provider/gno-provider";
import { Tx } from "@gnolang/tm2-js-client";

import { WalletClient } from "@common/clients/wallet-client";
import { CommonError } from "@common/errors";
import {
  DEFAULT_GAS_FEE,
  DEFAULT_GAS_WANTED,
  DEFAULT_NATIVE_AMOUNT_RESERVE,
  GAS_FEE_RESERVE_MARGIN,
  NATIVE_AMOUNT_RESERVE_BUFFER,
  PROBE_HEADROOM_CAP,
  PROBE_HEADROOM_RATIO,
  SMALL_BALANCE_PROBE_DIVISOR,
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
 * The flat fee a send path offers, in ugnot. Derived the way
 * `generateSendTransactionParams` derives it so the two cannot drift apart.
 * It is a floor for the reserve, not the whole of it: the wallet re-prices the
 * fee from its own gas estimate, and a heavy route costs more than this.
 */
const OFFERED_GAS_FEE = makeRawTokenAmount(GasToken, DEFAULT_GAS_FEE) ?? `${DEFAULT_NATIVE_AMOUNT_RESERVE}`;

const MINIMUM_GAS_PRICE = 0.001;

/**
 * How many times to narrow the amount after the probe. Each one is a route
 * lookup and a simulation, so the count trades latency for precision: from a
 * headroom of H the remaining slack is about H / 2^ATTEMPTS.
 */
const VERIFY_ATTEMPTS = 3;

type TransactionAccount = NonNullable<CreateTransactionDocumentParameters["account"]>;

const toUgnot = (value: BigNumber) => value.toFixed(0, BigNumber.ROUND_DOWN);

const ceilToUgnot = (value: BigNumber) => value.toFixed(0, BigNumber.ROUND_CEIL);

/**
 * Both costs are padded over what the probe measured, since both grow with the
 * amount. The fee never drops below what a send path offers outright, because
 * a wallet that takes the offered figure at face value would charge that much.
 */
function makeReserve(
  { gasUsed, storageDeposit }: SimulateTxResult,
  gasPrice: number,
  offeredGasFee: string,
): NativeAmountReserve {
  const pricedGasFee = BigNumber(gasUsed).multipliedBy(GAS_FEE_RESERVE_MARGIN).multipliedBy(gasPrice);

  const gasFee = BigNumber.maximum(offeredGasFee, ceilToUgnot(pricedGasFee)).toFixed(0);
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
 * The amounts to try probing at, in order of preference.
 *
 * A balance that can bear the fee is probed just below its ceiling, holding
 * back a share rather than a flat figure: both costs fall with the amount, so
 * a fixed GNOT would probe a small balance at a fraction of its ceiling and
 * measure costs nothing like the ones the final amount incurs. The wider share
 * is the retry, for when an extreme amount crosses enough ticks to lock a
 * deposit the first hold-back cannot cover.
 *
 * A balance smaller than the fee has no ceiling to probe near — holding back a
 * tenth still leaves nothing for the fee — so it is probed at a fraction of
 * itself, leaving almost all of it free to cover the costs being measured.
 */
function probeAmounts(balance: BigNumber, offeredGasFee: string): string[] {
  if (balance.isLessThanOrEqualTo(offeredGasFee)) {
    return [toUgnot(balance.dividedBy(SMALL_BALANCE_PROBE_DIVISOR))];
  }

  const proportional = ceilToUgnot(balance.multipliedBy(PROBE_HEADROOM_RATIO));
  const capped = BigNumber.minimum(PROBE_HEADROOM_CAP, proportional).toFixed(0);
  const headrooms = capped === proportional ? [capped] : [capped, proportional];

  return headrooms.map(headroom => toUgnot(balance.minus(headroom)));
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

    const offeredGasFee = request.gasFee ?? OFFERED_GAS_FEE;
    // Without a measurement the offered fee is the only certain cost.
    const fallbackReserve = request.fallbackReserve ?? offeredGasFee;

    const available = BigNumber(balance);
    const fallback = makeFallbackMaxNativeAmount(available, BigNumber(fallbackReserve));

    if (!this.rpcProvider || !this.transactionService) return fallback;

    // Simulating at the maximum would fail on the very costs being measured:
    // the node deducts the fee and locks the deposit against the real balance.
    // So the probe holds back room for both, which makes it an amount that
    // could have been broadcast as it stands.
    try {
      const gasPrice = (await this.getGasPrices()) || MINIMUM_GAS_PRICE;
      // Resolved once so the simulations below don't each ask the wallet.
      const account = await this.getAccountInfo();

      let probeAmount: BigNumber | null = null;
      let probe: SimulateTxResult | null = null;

      for (const candidate of probeAmounts(available, offeredGasFee)) {
        if (BigNumber(candidate).isLessThanOrEqualTo(0)) continue;

        // The fee only has to be payable for the measurement to run — gas used
        // does not depend on it — so it is the realistic figure where what the
        // probe held back covers it, and everything held back otherwise.
        const headroom = available.minus(candidate);
        const probeGasFee = BigNumber.minimum(headroom, ceilToUgnot(BigNumber(gasWanted).multipliedBy(gasPrice)));

        try {
          probe = await this.simulate(candidate, makeMessages, gasWanted, probeGasFee.toFixed(0), account);
          probeAmount = BigNumber(candidate);
          break;
        } catch {
          continue;
        }
      }

      if (!probe || !probeAmount) return fallback;

      // A balance under the offered fee could not be spent at all by a wallet
      // that charged it, so holding that much back would only ever return
      // nothing. What the simulation measured is the honest figure there.
      const feeFloor = available.isGreaterThan(offeredGasFee) ? offeredGasFee : "0";

      // The probe is the largest amount known to work, so it is the floor for
      // the answer. Each attempt reaches above it, and a failure bisects the
      // gap rather than trimming a percentage: on a large balance a relative
      // step throws away thousands of GNOT, while the costs it is groping for
      // are a few.
      let best = probeAmount;
      let reserve = makeReserve(probe, gasPrice, feeFloor);
      let candidate = BigNumber(toUgnot(available.minus(reserve.total)));

      for (let attempt = 0; attempt < VERIFY_ATTEMPTS; attempt += 1) {
        if (candidate.isLessThanOrEqualTo(best)) break;

        try {
          const verification = await this.simulate(
            toUgnot(candidate),
            makeMessages,
            gasWanted,
            reserve.gasFee,
            account,
          );

          reserve = makeReserve(verification, gasPrice, feeFloor);
          best = candidate;
          candidate = BigNumber(toUgnot(available.minus(reserve.total)));
        } catch {
          candidate = BigNumber(toUgnot(best.plus(candidate).dividedBy(2)));
        }
      }

      // The probe proves its own amount affordable, but the reserve can still
      // come out above the headroom it held back — a light action whose priced
      // fee lands under the flat one a send path offers. Keep both bounds.
      best = BigNumber.minimum(best, toUgnot(available.minus(reserve.total)));

      if (best.isLessThanOrEqualTo(0)) return fallback;

      // Report what is actually held back. The search can stop above the
      // computed reserve — a cost the probe could not see keeps the amount
      // down — and the breakdown should not claim otherwise.
      const withheld = available.minus(best);
      const measured = BigNumber(reserve.gasFee).plus(reserve.storageDeposit);

      return {
        amount: toUgnot(best),
        reserve: {
          ...reserve,
          buffer: BigNumber.maximum(withheld.minus(measured), 0).toFixed(0),
          total: withheld.toFixed(0),
        },
        simulated: true,
      };
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
