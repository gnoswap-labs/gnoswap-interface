import { atom } from "jotai";

import { DEFAULT_SLIPPAGE } from "@constants/option.constant";
import { DCA_INTERVAL } from "@models/order/dca-order-model";
import { DEFAULT_LIMIT_EXPIRY } from "@models/order/limit-order-model";
import { OrderListTab } from "@models/order/order-type";

/** DCA form. The token pair is shared with the swap form through `SwapState.swap`. */
export const dcaSellAmount = atom<string>("");

/** Seconds between executions. Defaults to one minute. */
export const dcaInterval = atom<number>(DCA_INTERVAL.MINUTE);

/** Number of executions as typed, so the field can be cleared while editing. */
export const dcaExecutionCount = atom<string>("2");

/** Limit form. */
export const limitSellAmount = atom<string>("");

/** Output per input. Empty until the market price is known. */
export const limitPrice = atom<string>("");

/** Percentage over the live router quote; null keeps a manually entered price. */
export const limitPricePreset = atom<number | null>(10);

/**
 * The `tokenA|tokenB` pair `limitPrice` belongs to, or null when it has not
 * been bound to a pair yet (a typed or restored price). The token pair is
 * shared with Swap and DCA, which can change it while Limit is not mounted.
 */
export const limitPricePairKey = atom<string | null>(null);

/** Seconds until the order expires. */
export const limitExpiry = atom<number>(DEFAULT_LIMIT_EXPIRY);

/** Limit-only tolerance in percent; never inherits the swap setting. */
export const limitSlippage = atom<number>(DEFAULT_SLIPPAGE);

export const orderListTab = atom<OrderListTab>("active");
