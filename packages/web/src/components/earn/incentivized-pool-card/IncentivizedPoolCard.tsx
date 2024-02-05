import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import { POOL_CONTENT_TITLE } from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import {
  PoolCardWrapper,
  PoolCardWrapperWrapperBorder,
} from "./IncentivizedPoolCard.styles";
import { PoolCardInfo } from "@models/pool/info/pool-card-info";
import { useMemo } from "react";
import { INCENTIVIZED_TYPE, SwapFeeTierInfoMap } from "@constants/option.constant";
import PoolGraph from "@components/common/pool-graph/PoolGraph";
import { usePositionData } from "@hooks/common/use-position-data";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import { numberToFormat } from "@utils/string-utils";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";

export interface IncentivizedPoolCardProps {
  pool: PoolCardInfo;
  routeItem: (id: string) => void;
  themeKey: "dark" | "light";
}

const IncentivizedPoolCard: React.FC<IncentivizedPoolCardProps> = ({
  pool,
  routeItem,
  themeKey,
}) => {
  const { isStakedPool } = usePositionData();
  const { getGnotPath } = useGnotToGnot();
  
  const staked = useMemo(() => {
    return isStakedPool(pool.poolPath || null);
  }, [isStakedPool, pool.poolPath]);

  const pairName = useMemo(() => {
    return `${pool.tokenA.symbol}/${pool.tokenB.symbol}`;
  }, [pool.tokenA.symbol, pool.tokenB.symbol]);

  const incentivizedLabel = useMemo(() => {
    if (pool.incentivizedType === "NONE_INCENTIVIZED") {
      return null;
    }
    return INCENTIVIZED_TYPE["INCENTIVIZED"];
  }, [pool.incentivizedType]);

  const rewardTokensInfo = useMemo(() => {
    const allRewardTokens = pool.rewardTokens;
    const temp = allRewardTokens.map((item) => {
      return {
        ...item,
        logoURI: getGnotPath(item).logoURI,
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
  }, [pool.rewardTokens, pool.tokenA, pool.tokenB]);
  
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
                      text={<OverlapTokenLogo tokens={rewardTokensInfo} size={16} />}
                    />
                  )}
                </div>
              </div>
             
            </div>
            <div className="list-wrapper">
              <div className="list-header">
                <span className="label-text">
                  {POOL_CONTENT_TITLE.TVL}
                </span>
                <span className="label-text">{POOL_CONTENT_TITLE.APR}</span>
              </div>
              <div className="list-content">
                <span className="value-text">${pool.liquidity}</span>
                <span className="value-text">{pool.apr}</span>
              </div>
            </div>
          </div>
          <div className="volume-container">
            <div className="volume-header">
              <div className="volume-title">
                <span className="label-text">{POOL_CONTENT_TITLE.VOLUME}</span>
                <span className="label-text">{POOL_CONTENT_TITLE.FEE}</span>
              </div>
              <div className="volume-content">
                <span className="value-text">${pool.volume24h}</span>
                <span className="value-text">${pool.fees24h}</span>
              </div>
            </div>
            <div className="pool-content" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
              <PoolGraph
                tokenA={pool.tokenA}
                tokenB={pool.tokenB}
                bins={pool.bins}
                currentTick={pool.currentTick}
                width={258}
                height={80}
                mouseover
                themeKey={themeKey}
                position="top"
                offset={40}
                poolPrice={pool?.price || 1}
              />
              <div className="price-section">
                <span className="label-text">
                  {"Current Price"}
                </span>
                <span className="label-text">{`1 ${pool.tokenA.symbol} = ${numberToFormat(pool.price, 2)} ${pool.tokenB.symbol}`}</span>
              </div>
            </div>
          </div>

          
        </PoolCardWrapper>
      </div>
    </PoolCardWrapperWrapperBorder>
  );
};

export default IncentivizedPoolCard;
