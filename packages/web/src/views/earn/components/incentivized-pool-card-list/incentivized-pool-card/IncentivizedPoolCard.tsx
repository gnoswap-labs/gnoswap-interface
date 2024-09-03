import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconStar from "@components/common/icons/IconStar";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import PoolGraph from "@components/common/pool-graph/PoolGraph";
import {
  INCENTIVE_TYPE_MAPPER,
  SwapFeeTierInfoMap,
} from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { IncentivizePoolCardInfo } from "@models/pool/info/pool-card-info";
import { formatRate } from "@utils/new-number-utils";
import { numberToFormat } from "@utils/string-utils";

import {
  PoolCardWrapper,
  PoolCardWrapperWrapperBorder,
} from "./IncentivizedPoolCard.styles";

export interface IncentivizedPoolCardProps {
  pool: IncentivizePoolCardInfo;
  routeItem: (id: string) => void;
  themeKey: "dark" | "light";
  checkStakedPool: (poolPath: string | null) => boolean;
}

const IncentivizedPoolCard: React.FC<IncentivizedPoolCardProps> = ({
  pool,
  routeItem,
  themeKey,
  checkStakedPool,
}) => {
  const { t } = useTranslation();
  const { getGnotPath } = useGnotToGnot();
  const staked = useMemo(() => {
    return checkStakedPool(pool.poolPath || null);
  }, [checkStakedPool, pool.poolPath]);

  const pairName = useMemo(() => {
    return `${pool.tokenA.symbol}/${pool.tokenB.symbol}`;
  }, [pool.tokenA.symbol, pool.tokenB.symbol]);

  const incentivizedLabel = useMemo(() => {
    if (pool.incentiveType === "NONE_INCENTIVIZED") {
      return null;
    }
    return INCENTIVE_TYPE_MAPPER["INCENTIVIZED"];
  }, [pool.incentiveType]);

  const rewardTokensInfo = useMemo(() => {
    const allRewardTokens = pool.rewardTokens.map(item => ({
      ...item,
      logoURI: getGnotPath(item).logoURI,
      path: getGnotPath(item).path,
      symbol: getGnotPath(item).symbol,
      name: getGnotPath(item).name,
    }));
    const temp = allRewardTokens.map(item => {
      return {
        ...item,
        logoURI: getGnotPath(item).logoURI,
        path: getGnotPath(item).path,
        symbol: getGnotPath(item).symbol,
        name: getGnotPath(item).name,
      };
    });
    const uniqueLogoURIs = new Set();
    const filteredArray = temp.filter(obj => {
      if (!uniqueLogoURIs.has(obj.logoURI)) {
        uniqueLogoURIs.add(obj.logoURI);
        return true;
      }
      return false;
    });
    return filteredArray;
  }, [getGnotPath, pool.rewardTokens]);

  const isHideBar = useMemo(() => {
    const isAllReserveZeroBin40 = pool.bins40.every(
      item =>
        Number(item.reserveTokenA) === 0 && Number(item.reserveTokenB) === 0,
    );

    return isAllReserveZeroBin40;
  }, [pool]);

  const aprStr = useMemo(() => {
    if (!pool.apr) return "-";

    return (
      <>
        {Number(pool.apr) > 100 && <IconStar size={20} />}
        {formatRate(pool.apr)}
      </>
    );
  }, [pool.apr]);

  return (
    <PoolCardWrapperWrapperBorder className={`${staked ? "special-card" : ""}`}>
      <div className="base-border">
        <PoolCardWrapper onClick={() => routeItem(pool.poolId)}>
          <div className="pool-container">
            <div className="title-container">
              <div className="box-header">
                <DoubleLogo
                  left={pool.tokenA.logoURI}
                  right={pool.tokenB.logoURI}
                  leftSymbol={pool.tokenA.symbol}
                  rightSymbol={pool.tokenB.symbol}
                  size={32}
                />
                <span>{pairName}</span>
                <div className="box-group">
                  <Badge
                    type={BADGE_TYPE.DARK_DEFAULT}
                    text={`${SwapFeeTierInfoMap[pool.feeTier].rateStr}`}
                  />
                  {incentivizedLabel && (
                    <Badge
                      type={BADGE_TYPE.DARK_DEFAULT}
                      text={
                        <OverlapTokenLogo tokens={rewardTokensInfo} size={16} />
                      }
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="list-wrapper">
              <div className="list-header">
                <span className="label-text">TVL</span>
                <span className="label-text">APR</span>
              </div>
              <div className="list-content">
                <span className="value-text">{pool.liquidity}</span>
                <span className="value-text apr-value">{aprStr}</span>
              </div>
            </div>
          </div>
          <div className="volume-container">
            <div className="volume-header">
              <div className="volume-title">
                <span className="label-text">
                  {t("Earn:incentiPools.card.col.volume")}
                </span>
                <span className="label-text">
                  {t("Earn:incentiPools.card.col.fees")}
                </span>
              </div>
              <div className="volume-content">
                <span className="value-text">{pool.volume24h}</span>
                <span className="value-text">{pool.fees24h}</span>
              </div>
            </div>
            <div
              className="pool-content"
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                e.stopPropagation()
              }
            >
              <PoolGraph
                tokenA={pool.tokenA}
                tokenB={pool.tokenB}
                bins={pool.bins40 ?? []}
                currentTick={pool.currentTick}
                width={258}
                height={80}
                mouseover
                themeKey={themeKey}
                position="top"
                offset={40}
                poolPrice={pool?.price || 1}
                disabled={isHideBar}
              />
              <div className="price-section">
                <span className="label-text">
                  {t("Earn:incentiPools.card.current.price")}
                </span>
                <span className="label-text">{`1 ${
                  pool.tokenA.symbol
                } = ${numberToFormat(pool.price, { decimals: 2 })} ${
                  pool.tokenB.symbol
                }`}</span>
              </div>
            </div>
          </div>
        </PoolCardWrapper>
      </div>
    </PoolCardWrapperWrapperBorder>
  );
};

export default IncentivizedPoolCard;
