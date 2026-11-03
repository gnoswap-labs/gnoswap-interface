import BigNumber from "bignumber.js";

import {
  DcaConfigResponse,
  DcaExecutionItem,
  DcaOrderItem,
  DcaScheduleResponse,
  LimitConfigResponse,
  LimitFillItem,
  LimitOrderItem,
} from "../response";

/**
 * Order-api responses built from dev.gnoswap data while the order API is not
 * deployed: token paths and decimals of dev.gnoswap pools, exchange rates from
 * their USD prices, and the config of the test order realms
 * (gno.land/r/gnoswap/test/order/{dca,limit}). Times are relative to now so the
 * lists always show ongoing orders and recent executions.
 */

interface DevToken {
  path: string;
  decimals: number;
  usd: number;
}

const DEV_TOKENS = {
  GNS: { path: "gno.land/r/gnoswap/gns.GNS", decimals: 6, usd: 58.0337 },
  WUGNOT: { path: "gno.land/r/gnoland/wugnot.wugnot", decimals: 6, usd: 0.0574 },
  USDC: { path: "gno.land/r/gnoswap/test_token/test_usdc.USDC", decimals: 6, usd: 0.0622 },
  SOL: { path: "gno.land/r/gnoswap/test_token/test_sol.SOL", decimals: 9, usd: 0.5913 },
  PHOTON: { path: "gno.land/r/gnoswap/test_token/test_photon.PHOTON", decimals: 6, usd: 61.1068 },
} satisfies Record<string, DevToken>;

const MINUTE = 60;
const HOUR = 3_600;
const DAY = 86_400;
const WEEK = 604_800;

/** Router swap fee and order execution fee of the dev realms, in basis points. */
const FEE_BPS = 15;

export const DEV_DCA_CONFIG: DcaConfigResponse = {
  allowedIntervals: [
    { interval: MINUTE, slotStep: MINUTE },
    { interval: HOUR, slotStep: HOUR },
    { interval: DAY, slotStep: HOUR },
    { interval: WEEK, slotStep: DAY },
    { interval: 30 * DAY, slotStep: DAY },
  ],
  minAmountPerExecution: "1",
  maxExecutionCount: 1000,
  executionFeeBps: FEE_BPS,
  routerFeeBps: FEE_BPS,
  minExecutionGapRate: 5000,
  minOrderUsd: "50",
  halted: { execute: false, withdraw: false },
};

export const DEV_LIMIT_CONFIG: LimitConfigResponse = {
  minMakingAmount: "100",
  minDurationSec: 300,
  maxDurationSec: 30 * DAY,
  executionFeeBps: FEE_BPS,
  routerFeeBps: FEE_BPS,
  maxSlippageBps: 1000,
  minOrderUsd: "50",
  halted: { execute: false, withdraw: false },
};

const nowSeconds = () => Math.floor(Date.now() / 1000);

/** The first time at or after now with `t % interval === offset`, as the DCA realm schedules slots. */
export function nextSlot(now: number, interval: number, offset = 0): number {
  return now + ((((offset - (now % interval)) % interval) + interval) % interval);
}

function raw(token: DevToken, amount: BigNumber.Value): string {
  return BigNumber(amount).shiftedBy(token.decimals).integerValue(BigNumber.ROUND_FLOOR).toFixed();
}

/** Output of one sale at the USD rate, nudged per round so the history is not flat, net of fees. */
function swapOutput(input: DevToken, output: DevToken, inputRaw: string, round: number): string {
  const drift = 1 + Math.sin(round * 1.7) * 0.004;
  const net = 1 - (2 * FEE_BPS) / 10_000;

  return BigNumber(inputRaw)
    .shiftedBy(-input.decimals)
    .multipliedBy(input.usd / output.usd)
    .multipliedBy(drift * net)
    .shiftedBy(output.decimals)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toFixed();
}

function mockHash(kind: string, id: string, index = 0): string {
  return `mock-${kind}-${id}-${index}`;
}

interface DcaPlan {
  orderId: string;
  input: DevToken;
  output: DevToken;
  interval: number;
  amountPerExecution: number;
  executionCount: number;
  executedCount: number;
  status: DcaOrderItem["status"];
  /** Seconds since the last executed round. */
  lastExecutedAgo: number;
}

interface DcaFixture {
  order: DcaOrderItem;
  executions: DcaExecutionItem[];
}

function buildDca(owner: string, plan: DcaPlan, now: number): DcaFixture {
  const { input, output, interval, executionCount, executedCount, status } = plan;
  const amountPerExecution = raw(input, plan.amountPerExecution);
  const lastExecutedAt = now - plan.lastExecutedAgo;
  const startRound = 100;

  const executions: DcaExecutionItem[] = Array.from({ length: executedCount }, (_, index) => {
    const round = startRound + executedCount - index;
    return {
      round,
      executedAt: lastExecutedAt - index * interval,
      txHash: mockHash("dca-round", plan.orderId, round),
      soldAmount: amountPerExecution,
      purchasedAmount: swapOutput(input, output, amountPerExecution, round),
      poolPath: `${input.path}:${output.path}:3000`,
    };
  });

  const purchased = executions.reduce((sum, item) => sum.plus(item.purchasedAmount), BigNumber(0));
  const remainingCount = status === "ACTIVE" ? executionCount - executedCount : 0;
  const unsold = BigNumber(amountPerExecution).multipliedBy(executionCount - executedCount);
  const createdAt = lastExecutedAt - executedCount * interval;
  const closed = status !== "ACTIVE";

  return {
    executions,
    order: {
      orderId: plan.orderId,
      owner,
      status,
      inputToken: input.path,
      outputToken: output.path,
      interval,
      slotOffset: 0,
      groupId: `${input.path}:${output.path}:${interval}:0`,
      amountPerExecution,
      executionCount,
      depositAmount: BigNumber(amountPerExecution).multipliedBy(executionCount).toFixed(),
      executedCount,
      remainingCount,
      soldAmount: BigNumber(amountPerExecution).multipliedBy(executedCount).toFixed(),
      purchasedAmount: purchased.toFixed(),
      remainingAmount: status === "ACTIVE" ? unsold.toFixed() : "0",
      // The keeper claims every three rounds, so recent output may still be unpaid.
      claimedAmount: closed ? purchased.toFixed() : purchased.multipliedBy(0.7).integerValue().toFixed(),
      claimableAmount: closed ? "0" : purchased.multipliedBy(0.3).integerValue(BigNumber.ROUND_CEIL).toFixed(),
      nextExecutionAt: remainingCount > 0 ? nextSlot(now + 1, interval) : null,
      createdAt,
      createdTxHash: mockHash("dca-create", plan.orderId),
      closedAt: closed ? lastExecutedAt + (status === "CANCELLED" ? interval / 2 : 0) : null,
      closedTxHash: closed ? mockHash("dca-close", plan.orderId) : null,
      refundedAmount: status === "CANCELLED" ? unsold.toFixed() : "0",
    },
  };
}

const DCA_PLANS: DcaPlan[] = [
  {
    orderId: "12",
    input: DEV_TOKENS.GNS,
    output: DEV_TOKENS.WUGNOT,
    interval: HOUR,
    amountPerExecution: 1,
    executionCount: 24,
    executedCount: 9,
    status: "ACTIVE",
    lastExecutedAgo: 10 * MINUTE,
  },
  {
    orderId: "11",
    input: DEV_TOKENS.SOL,
    output: DEV_TOKENS.WUGNOT,
    interval: DAY,
    amountPerExecution: 100,
    executionCount: 7,
    executedCount: 3,
    status: "ACTIVE",
    lastExecutedAgo: 5 * HOUR,
  },
  {
    orderId: "8",
    input: DEV_TOKENS.WUGNOT,
    output: DEV_TOKENS.GNS,
    interval: MINUTE,
    amountPerExecution: 1000,
    executionCount: 12,
    executedCount: 12,
    status: "COMPLETED",
    lastExecutedAgo: 2 * DAY,
  },
  {
    orderId: "5",
    input: DEV_TOKENS.PHOTON,
    output: DEV_TOKENS.GNS,
    interval: WEEK,
    amountPerExecution: 1,
    executionCount: 4,
    executedCount: 2,
    status: "CANCELLED",
    lastExecutedAgo: 3 * DAY,
  },
];

export function devDcaFixtures(owner: string): DcaFixture[] {
  const now = nowSeconds();
  return DCA_PLANS.map(plan => buildDca(owner, plan, now));
}

export function devDcaSchedule(interval: number, executionCount: number): DcaScheduleResponse {
  const firstExecutionAt = nextSlot(nowSeconds(), interval);
  return {
    groupId: "",
    slotOffset: 0,
    firstExecutionAt,
    estimatedEndAt: firstExecutionAt + (executionCount - 1) * interval,
    groupActive: false,
  };
}

interface LimitPlan {
  orderId: string;
  tokenIn: DevToken;
  tokenOut: DevToken;
  making: number;
  /** Limit price over the USD market rate. */
  premium: number;
  /** Share of the input sold. */
  filledRatio: number;
  fills: number;
  status: LimitOrderItem["status"];
  createdAgo: number;
  duration: number;
}

interface LimitFixture {
  order: LimitOrderItem;
  fills: LimitFillItem[];
}

function buildLimit(owner: string, plan: LimitPlan, now: number): LimitFixture {
  const { tokenIn, tokenOut } = plan;
  const making = raw(tokenIn, plan.making);
  const taking = BigNumber(swapOutput(tokenIn, tokenOut, making, 0))
    .multipliedBy(plan.premium)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toFixed();
  const filled = BigNumber(making).multipliedBy(plan.filledRatio).integerValue(BigNumber.ROUND_FLOOR);
  const createdAt = now - plan.createdAgo;
  const expiresAt = createdAt + plan.duration;
  const perFill = filled.dividedToIntegerBy(Math.max(plan.fills, 1));

  const fills: LimitFillItem[] = Array.from({ length: plan.fills }, (_, index) => {
    const amountIn = index === 0 ? filled.minus(perFill.multipliedBy(plan.fills - 1)) : perFill;
    const gross = BigNumber(taking).multipliedBy(amountIn).dividedBy(making).multipliedBy(1.002);
    const fee = gross.multipliedBy(FEE_BPS).dividedBy(10_000).integerValue(BigNumber.ROUND_FLOOR);
    return {
      txHash: mockHash("limit-fill", plan.orderId, index),
      amountIn: amountIn.toFixed(),
      userOutput: gross.minus(fee).integerValue(BigNumber.ROUND_FLOOR).toFixed(),
      executionFee: fee.toFixed(),
      blockTime: createdAt + Math.floor(((index + 1) * Math.min(plan.createdAgo, plan.duration)) / (plan.fills + 1)),
    };
  });
  fills.reverse();

  const userOutput = fills.reduce((sum, fill) => sum.plus(fill.userOutput), BigNumber(0));
  const pending = plan.status === "OPEN" || plan.status === "PARTIALLY_FILLED";
  const unfilled = BigNumber(making).minus(filled);

  return {
    fills,
    order: {
      orderId: plan.orderId,
      owner,
      status: plan.status,
      tokenIn: tokenIn.path,
      tokenOut: tokenOut.path,
      makingAmount: making,
      takingAmount: taking,
      slippageBps: 50,
      executionFeeRate: FEE_BPS,
      filledInput: filled.toFixed(),
      remainingInput: pending ? unfilled.toFixed() : "0",
      refundedInput: pending ? "0" : unfilled.toFixed(),
      userOutput: userOutput.toFixed(),
      createdAt,
      expiresAt,
      createdTxHash: mockHash("limit-create", plan.orderId),
      closedAt: pending ? null : Math.min(now, expiresAt),
      closedTxHash: pending ? null : mockHash("limit-close", plan.orderId),
    },
  };
}

const LIMIT_PLANS: LimitPlan[] = [
  {
    orderId: "9",
    tokenIn: DEV_TOKENS.GNS,
    tokenOut: DEV_TOKENS.USDC,
    making: 2,
    premium: 1.03,
    filledRatio: 0.25,
    fills: 1,
    status: "PARTIALLY_FILLED",
    createdAgo: 3 * HOUR,
    duration: DAY,
  },
  {
    orderId: "8",
    tokenIn: DEV_TOKENS.WUGNOT,
    tokenOut: DEV_TOKENS.SOL,
    making: 2000,
    premium: 1.05,
    filledRatio: 0,
    fills: 0,
    status: "OPEN",
    createdAgo: 40 * MINUTE,
    duration: WEEK,
  },
  {
    orderId: "6",
    tokenIn: DEV_TOKENS.PHOTON,
    tokenOut: DEV_TOKENS.GNS,
    making: 3,
    premium: 1.01,
    filledRatio: 1,
    fills: 2,
    status: "COMPLETED",
    createdAgo: 2 * DAY,
    duration: DAY,
  },
  {
    orderId: "3",
    tokenIn: DEV_TOKENS.SOL,
    tokenOut: DEV_TOKENS.USDC,
    making: 120,
    premium: 1.1,
    filledRatio: 0,
    fills: 0,
    status: "EXPIRED",
    createdAgo: 9 * DAY,
    duration: WEEK,
  },
];

export function devLimitFixtures(owner: string): LimitFixture[] {
  const now = nowSeconds();
  return LIMIT_PLANS.map(plan => buildLimit(owner, plan, now));
}
