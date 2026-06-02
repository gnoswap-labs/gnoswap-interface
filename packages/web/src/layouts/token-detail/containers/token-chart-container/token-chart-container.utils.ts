import BigNumber from "bignumber.js";

import { formatPrice } from "@utils/new-number-utils";

export const formatTokenDetailMainPrice = (currentPrice?: BigNumber | string | number | null) =>
  formatPrice(currentPrice, { isKMB: false, forcedDecimals: true });
