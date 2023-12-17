import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import { POOL_CONTENT_TITLE } from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import {
  PoolCardWrapper,
  PoolCardWrapperWrapperBorder,
} from "./IncentivizedPoolCard.styles";
import { PoolCardInfo } from "@models/pool/info/pool-card-info";
import { useMemo } from "react";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import PoolGraph from "@components/common/pool-graph/PoolGraph";
import DoubleTokenLogo from "@components/common/double-token-logo/DoubleTokenLogo";
import { usePositionData } from "@hooks/common/use-position-data";

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

  const staked = useMemo(() => {
    return isStakedPool(pool.poolPath || null);
  }, [isStakedPool, pool.poolPath]);

  const pairName = useMemo(() => {
    return `${pool.tokenA.symbol}/${pool.tokenB.symbol}`;
  }, [pool.tokenA.symbol, pool.tokenB.symbol]);

  return (
    <PoolCardWrapperWrapperBorder className={`${staked ? "special-card" : ""}`}>
      <div className="base-border">
        <PoolCardWrapper onClick={() => routeItem(pool.poolId)}>
          <div className="pool-container">
            <div className="title-container">
              <div className="box-header">
                <DoubleTokenLogo
                  left={pool.tokenA}
                  right={pool.tokenB}
                />
                <span>{pairName}</span>
              </div>
              <div className="box-group">
                <Badge
                  type={BADGE_TYPE.DARK_DEFAULT}
                  text={<>
                    Incentivized
                    <DoubleTokenLogo
                      size={16}
                      left={pool.tokenA}
                      right={pool.tokenB}
                      fontSize={6}
                    />
                  </>}
                />
                <Badge
                  type={BADGE_TYPE.DARK_DEFAULT}
                  text={`${SwapFeeTierInfoMap[pool.feeTier].rateStr} Fee`}
                />
              </div>
            </div>
            <div className="list-wrapper">
              <div className="list-header">
                <span className="label-text">
                  {POOL_CONTENT_TITLE.LIQUIDITY}
                </span>
                <span className="label-text">{POOL_CONTENT_TITLE.APR}</span>
              </div>
              <div className="list-content">
                <span className="value-text">{pool.liquidity}</span>
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
                <span className="value-text">{pool.volume24h}</span>
                <span className="value-text">{pool.fees24h}</span>
              </div>
            </div>
            <div className="pool-content" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
              <PoolGraph
                tokenA={pool.tokenA}
                tokenB={pool.tokenB}
                bins={pool.bins}
                currentTick={pool.currentTick}
                width={258}
                height={80.62}
                mouseover
                themeKey={themeKey}
              />
            </div>
          </div>
        </PoolCardWrapper>
      </div>
    </PoolCardWrapperWrapperBorder>
  );
};

export default IncentivizedPoolCard;
