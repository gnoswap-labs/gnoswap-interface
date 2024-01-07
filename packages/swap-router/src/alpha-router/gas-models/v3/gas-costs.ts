import BigNumber from "bignumber.js";
import { ChainId, Currency, Token } from "../../core";
import { V3Route } from "../../router";

// Cost for crossing an uninitialized tick.
export const COST_PER_UNINIT_TICK = BigNumber(0);

//l2 execution fee on optimism is roughly the same as mainnet
export const BASE_SWAP_COST = (id: ChainId): BigNumber => {
  switch (id) {
    case ChainId.MAINNET:
    case ChainId.TEST3:
    case ChainId.BETA_GNOSWAP:
    case ChainId.DEV_GNOSWAP:
    default:
      return BigNumber(2000);
  }
};
export const COST_PER_INIT_TICK = (id: ChainId): BigNumber => {
  switch (id) {
    case ChainId.MAINNET:
    case ChainId.TEST3:
    case ChainId.BETA_GNOSWAP:
    case ChainId.DEV_GNOSWAP:
    default:
      return BigNumber(31000);
  }
};

export const COST_PER_HOP = (id: ChainId): BigNumber => {
  switch (id) {
    case ChainId.MAINNET:
    case ChainId.TEST3:
    case ChainId.BETA_GNOSWAP:
    case ChainId.DEV_GNOSWAP:
    default:
      return BigNumber(80000);
  }
};

export const SINGLE_HOP_OVERHEAD = (_id: ChainId): BigNumber => {
  return BigNumber(15000);
};

export const TOKEN_OVERHEAD = (id: ChainId, route: V3Route): BigNumber => {
  const tokens: Token[] = route.tokenPath;
  let overhead = BigNumber(0);
  return overhead;
};

// TODO: change per chain
export const NATIVE_WRAP_OVERHEAD = (id: ChainId): BigNumber => {
  switch (id) {
    default:
      return BigNumber(27938);
  }
};

export const NATIVE_UNWRAP_OVERHEAD = (id: ChainId): BigNumber => {
  switch (id) {
    default:
      return BigNumber(36000);
  }
};

export const NATIVE_OVERHEAD = (
  chainId: ChainId,
  amount: Currency,
  quote: Currency,
): BigNumber => {
  if (amount.isNative) {
    // need to wrap eth in
    return NATIVE_WRAP_OVERHEAD(chainId);
  }
  if (quote.isNative) {
    // need to unwrap eth out
    return NATIVE_UNWRAP_OVERHEAD(chainId);
  }
  return BigNumber(0);
};
