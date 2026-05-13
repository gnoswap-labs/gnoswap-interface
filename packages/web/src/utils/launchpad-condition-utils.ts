import BigNumber from "bignumber.js";

import { XGNS_TOKEN } from "@common/values/token-constant";
import { XGNS_TOKEN_PATH } from "@constants/environment.constant";
import { LaunchpadProjectConditionModel } from "@models/launchpad";
import { TokenModel } from "@models/token/token-model";

export function getLaunchpadConditionToken(
  condition: LaunchpadProjectConditionModel,
  tokens: TokenModel[],
): TokenModel | null {
  if (condition.tokenPath === XGNS_TOKEN_PATH) {
    return XGNS_TOKEN;
  }

  return tokens.find(token => token.path === condition.tokenPath) ?? null;
}

export function getLaunchpadConditionDisplayAmount(
  condition: LaunchpadProjectConditionModel,
  tokens: TokenModel[],
): BigNumber {
  const token = getLaunchpadConditionToken(condition, tokens);
  const amount = BigNumber(condition.leastTokenAmount || 0);

  if (!token) {
    return amount;
  }

  return amount.shiftedBy(-(token.decimals || 0));
}

export function formatLaunchpadConditionAmount(
  condition: LaunchpadProjectConditionModel,
  tokens: TokenModel[],
): string {
  return getLaunchpadConditionDisplayAmount(condition, tokens).toFormat();
}

export function getLaunchpadConditionSymbol(condition: LaunchpadProjectConditionModel, tokens: TokenModel[]): string {
  const token = getLaunchpadConditionToken(condition, tokens);

  if (token) {
    return token.symbol;
  }

  return condition.tokenPath.split("/").pop()?.toUpperCase() ?? "";
}
