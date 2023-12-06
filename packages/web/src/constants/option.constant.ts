import { ValuesType } from "utility-types";

export type SwapFeeTierType =
  | "FEE_100"
  | "FEE_500"
  | "FEE_3000"
  | "FEE_10000"
  | "NONE";

export interface SwapFeeTierInfo {
  type: SwapFeeTierType;
  fee: number;
  tickSpacing: number;
  rateStr: string;
  description: string;
}

export const SwapFeeTierPriceRange: Record<
  SwapFeeTierType,
  Record<PriceRangeType, { min: number; max: number }>
> = {
  FEE_100: {
    Active: {
      min: -0.5,
      max: 0.5,
    },
    Passive: {
      min: -1,
      max: 1,
    },
    Custom: {
      min: -1,
      max: 1,
    },
  },
  FEE_500: {
    Active: {
      min: -10,
      max: 10,
    },
    Passive: {
      min: -50,
      max: 100,
    },
    Custom: {
      min: -50,
      max: 100,
    },
  },
  FEE_3000: {
    Active: {
      min: -10,
      max: 10,
    },
    Passive: {
      min: -50,
      max: 100,
    },
    Custom: {
      min: -50,
      max: 100,
    },
  },
  FEE_10000: {
    Active: {
      min: -10,
      max: 10,
    },
    Passive: {
      min: -50,
      max: 100,
    },
    Custom: {
      min: -50,
      max: 100,
    },
  },
  NONE: {
    Active: {
      min: -50,
      max: 50,
    },
    Passive: {
      min: -50,
      max: 100,
    },
    Custom: {
      min: -50,
      max: 100,
    },
  },
};

export const SwapFeeTierInfoMap: Record<SwapFeeTierType, SwapFeeTierInfo> = {
  FEE_100: {
    type: "FEE_100",
    fee: 100,
    tickSpacing: 2,
    rateStr: "0.01%",
    description: "Best for very stable pairs",
  },
  FEE_500: {
    type: "FEE_500",
    fee: 500,
    tickSpacing: 10,
    rateStr: "0.05%",
    description: "Best for stable pairs",
  },
  FEE_3000: {
    type: "FEE_3000",
    fee: 3000,
    tickSpacing: 60,
    rateStr: "0.3%",
    description: "Best for most pairs",
  },
  FEE_10000: {
    type: "FEE_10000",
    fee: 10000,
    tickSpacing: 200,
    rateStr: "1%",
    description: "Best for exotic pairs",
  },
  NONE: {
    type: "NONE",
    fee: 0,
    tickSpacing: 1,
    rateStr: "-",
    description: "-",
  },
} as const;

export const FEE_RATE_OPTION = {
  FEE_01: "0.01",
  FEE_05: "0.05",
  FEE_3: "0.3",
  FEE_1: "1",
} as const;
export type FeeRateOption = ValuesType<typeof FEE_RATE_OPTION>;

export const STAKED_OPTION = {
  NONE: "NONE",
  STAKED: "Staked",
  UNSTAKING: "Unstaking",
  UNSTAKED: "Unstaked",
} as const;
export type STAKED_OPTION = ValuesType<typeof STAKED_OPTION>;

export const STATUS_OPTION = {
  SUCCESS: "SUCCESS",
  PENDING: "PENDING",
  FAILED: "FAILED",
} as const;
export type STATUS_OPTION = ValuesType<typeof STATUS_OPTION>;

export const ACTIVE_STATUS_OPTION = {
  NONE: "NONE",
  ACTIVE: "ACTIVE",
  IN_ACTIVE: "IN_ACTIVE",
} as const;
export type ACTIVE_STATUS_OPTION = ValuesType<typeof ACTIVE_STATUS_OPTION>;

export const RANGE_STATUS_OPTION = {
  NONE: "NONE",
  IN: "IN",
  OUT: "OUT",
} as const;
export type RANGE_STATUS_OPTION = ValuesType<typeof RANGE_STATUS_OPTION>;

export const MATH_NEGATIVE_TYPE = {
  NEGATIVE: "NEGATIVE",
  POSITIVE: "POSITIVE",
  NONE: "NONE",
} as const;
export type MATH_NEGATIVE_TYPE = ValuesType<typeof MATH_NEGATIVE_TYPE>;

export const INCENTIVIZED_TYPE = {
  INCENTIVIZED: "Incentivized",
  NON_INCENTIVIZED: "Non_Incentivized",
  EXTERNAL_INCENTIVIZED: "External_Incentivized",
} as const;
export type INCENTIVIZED_TYPE = ValuesType<typeof INCENTIVIZED_TYPE>;

export const CHART_TYPE = {
  "7D": "7D",
  "1M": "1M",
  "1Y": "1Y",
  ALL: "ALL",
} as const;
export type CHART_TYPE = ValuesType<typeof CHART_TYPE>;

export type AddLiquidityType = "POOL" | "LIQUIDITY";

export type PriceRangeType = "Active" | "Passive" | "Custom";

export const PriceRangeTooltip: {
  [key in SwapFeeTierType]: { [key in PriceRangeType]: string | undefined };
} = {
  FEE_10000: {
    Active:
      "An aggressive price range of [-10% ~ +10%] for higher risks & returns.",
    Passive:
      "A passive price range of [-50% ~ 100%] <br />for moderate risks & returns.",
    Custom: undefined,
  },
  FEE_3000: {
    Active:
      "An aggressive price range of [-10% ~ +10%] for higher risks & returns.",
    Passive:
      "A passive price range of [-50% ~ 100%] <br />for moderate risks & returns.",
    Custom: undefined,
  },
  FEE_500: {
    Active:
      "An aggressive price range of [-10% ~ +10%] for higher risks & returns.",
    Passive:
      "A passive price range of [-50% ~ 100%] <br />for moderate risks & returns.",
    Custom: undefined,
  },
  FEE_100: {
    Active:
      "An aggressive price range of [-0.5% ~ +0.5%] for higher risks & returns.",
    Passive:
      "A passive price range of [-1% ~ 1%] <br />for moderate risks & returns.",
    Custom: undefined,
  },
  NONE: {
    Active: undefined,
    Passive: undefined,
    Custom: undefined,
  },
};

export const DEFAULT_SLIPPAGE = "0.5";

export type AddLiquiditySubmitType =
  | "CREATE_POOL"
  | "ADD_LIQUIDITY"
  | "CONNECT_WALLET"
  | "INVALID_PAIR"
  | "ENTER_AMOUNT"
  | "INSUFFICIENT_BALANCE"
  | "INVALID_RANGE"
  | "SWITCH_NETWORK"
  | "SELECT_TOKEN"
  | "AMOUNT_TOO_LOW";
