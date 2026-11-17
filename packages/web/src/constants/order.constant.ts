import { PACKAGE_DCA_ORDER_PATH, PACKAGE_LIMIT_ORDER_PATH } from "@constants/environment.constant";
import { getEnabledSwapCardTypes, hasOrderSwapCardTypes } from "@models/order/order-type";

/** Swap card modes enabled by the configured order realm paths. */
export const ENABLED_SWAP_CARD_TYPES = getEnabledSwapCardTypes({
  dcaOrderPath: PACKAGE_DCA_ORDER_PATH,
  limitOrderPath: PACKAGE_LIMIT_ORDER_PATH,
});

/** False when neither order realm is configured: the swap page renders as before, without order UI. */
export const IS_ORDER_ENABLED = hasOrderSwapCardTypes(ENABLED_SWAP_CARD_TYPES);
