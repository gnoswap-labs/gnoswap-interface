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

export const SwapFeeTierMaxPriceRangeMap: Record<
  SwapFeeTierType,
  {
    minTick: number;
    minPrice: number;
    maxTick: number;
    maxPrice: number;
  }
> = {
  FEE_100: {
    minTick: -887272,
    minPrice: 2.9389568087743114e-39,
    maxTick: 887272,
    maxPrice: 3.4025678683638813e38,
  },
  FEE_500: {
    minTick: -887270,
    minPrice: 2.93954462969822e-39,
    maxTick: 887270,
    maxPrice: 3.4018874568536357e38,
  },
  FEE_3000: {
    minTick: -887220,
    minPrice: 2.954278419690599e-39,
    maxTick: 887220,
    maxPrice: 3.384921318552238e38,
  },
  FEE_10000: {
    minTick: -887200,
    minPrice: 2.9601925924784057e-39,
    maxTick: 887200,
    maxPrice: 3.378158579040119e38,
  },
  NONE: {
    minTick: -887272,
    minPrice: 2.9389568087743114e-39,
    maxTick: 887272,
    maxPrice: 3.4025678683638813e38,
  },
};

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
    tickSpacing: 1,
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

export const INCENTIVE_TYPE_MAPPER = {
  INCENTIVIZED: "Incentivized",
  NONE_INCENTIVIZED: "Non-Incentivized",
  EXTERNAL: "External-Incentivized",
} as const;
export type INCENTIVE_TYPE =
  | "INCENTIVIZED"
  | "NONE_INCENTIVIZED"
  | "EXTERNAL"
  | "INTERNAL";

export const CHART_TYPE = {
  "7D": "7D",
  "30D": "30D",
  "90D": "90D",
  ALL: "ALL",
} as const;
export type CHART_TYPE = ValuesType<typeof CHART_TYPE>;

export const CHART_DAY_SCOPE_TYPE = {
  "7D": "7D",
  "30D": "30D",
  ALL: "ALL",
} as const;

export type CHART_DAY_SCOPE_TYPE = ValuesType<typeof CHART_DAY_SCOPE_TYPE>;

export type AddLiquidityType = "POOL" | "LIQUIDITY";

export type PriceRangeType = "Active" | "Passive" | "Custom";

export const PriceRangeTooltip: {
  [key in SwapFeeTierType]: { [key in PriceRangeType]: string | undefined };
} = {
  FEE_10000: {
    Active: "An aggressive price range for higher risks & returns.",
    Passive: "A passive price range for moderate risks & returns.",
    Custom: undefined,
  },
  FEE_3000: {
    Active: "An aggressive price range for higher risks & returns.",
    Passive: "A passive price range for moderate risks & returns.",
    Custom: undefined,
  },
  FEE_500: {
    Active: "An aggressive price range for higher risks & returns.",
    Passive: "A passive price range for moderate risks & returns.",
    Custom: undefined,
  },
  FEE_100: {
    Active: "An aggressive price range for higher risks & returns.",
    Passive: "A passive price range for moderate risks & returns.",
    Custom: undefined,
  },
  NONE: {
    Active: undefined,
    Passive: undefined,
    Custom: undefined,
  },
};

export const PriceRangeStr: {
  [key in SwapFeeTierType]: { [key in PriceRangeType]: string };
} = {
  FEE_10000: {
    Active: "[-10% / +10%]",
    Passive: "[-50% / +100%]",
    Custom: "",
  },
  FEE_3000: {
    Active: "[-10% / +10%]",
    Passive: "[-50% / +100%]",
    Custom: "",
  },
  FEE_500: {
    Active: "[-10% / +10%]",
    Passive: "[-50% / +100%]",
    Custom: "",
  },
  FEE_100: {
    Active: "[-0.5% / +0.5%]",
    Passive: "[-1% / +1%]",
    Custom: "",
  },
  NONE: {
    Active: "",
    Passive: "",
    Custom: "",
  },
};

export const DEFAULT_SLIPPAGE = 0.5;
export const MIN_SLIPPAGE = 0;
export const MAX_SLIPPAGE = 50;

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

export type RewardType = "SWAP_FEE" | "EXTERNAL" | "INTERNAL";

export type StakingPeriodType = "5D" | "10D" | "30D" | "MAX";

export const STAKING_PERIOS: StakingPeriodType[] = ["5D", "10D", "30D", "MAX"];

export const STAKING_PERIOD_INFO: {
  [key in StakingPeriodType]: {
    title: string;
    description: string;
    tooltipContent: string;
    period: number;
    rate: number;
  };
} = {
  "5D": {
    title: "Staked less than 5 days",
    description: "30% of Max Rewards",
    tooltipContent:
      "During this staking period, you will only receive 30% of your maximum staking rewards. Keep your position staked to increase your rewards.",
    period: 5,
    rate: 0.3,
  },
  "10D": {
    title: "Staked less than 10 days",
    description: "50% of Max Rewards",
    tooltipContent:
      "During this staking period, you will only receive 50% of your maximum staking rewards. Keep your position staked to increase your rewards.",
    period: 10,
    rate: 0.5,
  },
  "30D": {
    title: "Staked less than 30 days",
    description: "70% of Max Rewards",
    tooltipContent:
      "During this staking period, you will only receive 70% of your maximum staking rewards. Keep your position staked to increase your rewards.",
    period: 30,
    rate: 0.7,
  },
  MAX: {
    title: "Staked more than 30 days",
    description: "Receiving Max Rewards",
    tooltipContent:
      "During this staking period, you will receive maximum staking rewards. Keep your position staked to maintain your rewards.",
    period: -1,
    rate: 1,
  },
} as const;

export interface DefaultTick {
  tickLower?: number;
  tickUpper?: number;
}
