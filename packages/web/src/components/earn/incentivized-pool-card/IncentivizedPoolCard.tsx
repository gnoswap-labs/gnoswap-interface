import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { POOL_CONTENT_TITLE } from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import {
  PoolCardWrapper,
  PoolCardWrapperWrapperBorder,
} from "./IncentivizedPoolCard.styles";
import { PoolCardInfo } from "@models/pool/info/pool-card-info";
import { useMemo } from "react";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import PoolGraph from "@components/common/pool-graph/PoolGraph";
import POOLS from "@repositories/pool/mock/pools.json";
const POOL_DATA = POOLS.pools[0].bins;
const POOL_DATA_RIGHT  = POOL_DATA.map((item, index) => ({
  ...item,
  currentTick: index + 21,
}));

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
  const pairName = useMemo(() => {
    return `${pool.tokenA.symbol}/${pool.tokenB.symbol}`;
  }, [pool.tokenA.symbol, pool.tokenB.symbol]);

  return (
    <PoolCardWrapperWrapperBorder
      className={["special-card", ""][Math.floor(Math.random() * 2)]}
    >
      <div className="base-border">
        <PoolCardWrapper onClick={() => routeItem(pool.poolId)}>
          <div className="pool-container">
            <div className="title-container">
              <div className="box-header">
                <DoubleLogo
                  left={pool.tokenA.logoURI}
                  right={pool.tokenB.logoURI}
                />
                <span>{pairName}</span>
              </div>
              <div className="box-group">
                <Badge
                  type={BADGE_TYPE.DARK_DEFAULT}
                  text={<>
                  Incentivized
                  <DoubleLogo
                    size={16}
                    left={pool.tokenA.logoURI}
                    right={pool.tokenB.logoURI}
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
                bins={[...POOL_DATA, ...POOL_DATA_RIGHT]}
                currentTick={20}
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
