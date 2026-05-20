import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconInfo from "@components/common/icons/IconInfo";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import { checkGnotPath } from "@utils/common";
import { formatOtherPrice, formatPoolPairAmount, formatRate } from "@utils/new-number-utils";

import { HoverTextWrapper, wrapper } from "./SelectStakeResult.styles";

interface SelectStakeResultProps {
  positions: PoolPositionModel[];
  isHiddenBadge?: boolean;
}

interface PooledTokenEntry {
  token: TokenModel;
  amount: number;
  usd: number | null;
}

const SelectStakeResult: React.FC<SelectStakeResultProps> = ({ positions, isHiddenBadge = false }) => {
  const { t } = useTranslation();
  const { tokenPrices } = useTokenData();

  const pooledTokenEntries = useMemo<PooledTokenEntry[]>(() => {
    const entries = new Map<string, PooledTokenEntry>();

    const addContribution = (token: TokenModel, balance: string | number | null | undefined) => {
      const amount = Number(balance ?? 0);
      if (!token?.path || !amount) return;

      const priceId = checkGnotPath(token.priceID);
      const rawPrice = tokenPrices[priceId]?.usd;
      const price = rawPrice ? Number(rawPrice) : null;

      const existing = entries.get(token.path);
      if (existing) {
        existing.amount += amount;
        if (price !== null) {
          existing.usd = (existing.usd ?? 0) + amount * price;
        }
      } else {
        entries.set(token.path, {
          token,
          amount,
          usd: price !== null ? amount * price : null,
        });
      }
    };

    for (const position of positions) {
      addContribution(position.pool.tokenA, position.tokenABalance);
      addContribution(position.pool.tokenB, position.tokenBBalance);
    }

    return Array.from(entries.values());
  }, [positions, tokenPrices]);

  const totalLiquidityUSD = useMemo(() => {
    if (positions.length === 0) return "-";

    const total = positions.reduce<number | null>((acc, position) => {
      const value = Number(position.positionUsdValue ?? 0);
      if (!value) return acc;
      return (acc ?? 0) + value;
    }, null);

    return formatOtherPrice(total, { isKMB: false });
  }, [positions]);

  const stakingAPR = useMemo(() => {
    // USD-Value-weighted average of each position's pool staking APR:
    //   APR = Σ (pool_APR_i × USD_i) / Σ USD_j
    // A position with 0% APR still contributes its USD value to the denominator,
    // so the displayed rate stays consistent with the spec when the selection
    // mixes incentivized and non-incentivized pools.
    let weightedSum = 0;
    let totalWeight = 0;

    for (const position of positions) {
      const weight = Number(position.positionUsdValue ?? 0);
      if (!Number.isFinite(weight) || weight <= 0) continue;

      const aprValue = Number(position.pool?.stakingApr ?? 0);
      const contribution = Number.isFinite(aprValue) && aprValue > 0 ? aprValue : 0;

      weightedSum += contribution * weight;
      totalWeight += weight;
    }

    if (totalWeight <= 0) return "-";
    const averageApr = weightedSum / totalWeight;
    return `${formatRate(averageApr * 0.3)} ~ ${formatRate(averageApr)}`;
  }, [positions]);

  if (positions.length === 0) return null;

  return (
    <div css={wrapper}>
      <ul className="pooled-section">
        {pooledTokenEntries.map(entry => (
          <li key={entry.token.path}>
            <div className="main-info">
              <MissingLogo symbol={entry.token.symbol} url={entry.token.logoURI} width={24} mobileWidth={24} />
              <p>
                {t("StakePosition:overview.pooled")} {entry.token.displaySymbol}
              </p>
              <strong>
                {formatPoolPairAmount(entry.amount, {
                  decimals: entry.token.decimals,
                  isKMB: false,
                })}
              </strong>
            </div>
            <span className="dallor">{entry.usd !== null ? formatOtherPrice(entry.usd, { isKMB: false }) : "-"}</span>
          </li>
        ))}
      </ul>
      <div className="result-section">
        <div className="total-amount-box">
          <h5 className="total-amount-title">{t("StakePosition:totalAmt")}</h5>
          {!isHiddenBadge && <Badge text={"21 days"} type={BADGE_TYPE.DARK_DEFAULT} />}
          <span className="result-value">{totalLiquidityUSD}</span>
        </div>
        <div className="apr-box">
          <h5 className="apr-title">{t("StakePosition:overview.stakingApr.label")}</h5>
          <div className="hover-info">
            <Tooltip
              placement="top"
              FloatingContent={<HoverTextWrapper> {t("StakePosition:overview.stakingApr.tooltip")}</HoverTextWrapper>}
            >
              <IconInfo className="icon-info" />
            </Tooltip>
          </div>
          <span className="result-value">{stakingAPR}</span>
        </div>
      </div>
    </div>
  );
};

export default SelectStakeResult;
