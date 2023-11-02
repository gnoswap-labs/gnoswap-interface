import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconSwap from "@components/common/icons/IconSwap";
import {
  POOL_CONTENT_TITLE,
} from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import { PoolCardWrapper } from "./IncentivizedPoolCard.styles";
import { PoolCardInfo } from "@models/pool/info/pool-card-info";
import { useMemo } from "react";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import PoolGraph from "@components/common/pool-graph/PoolGraph";

export interface IncentivizedPoolCardProps {
  pool: PoolCardInfo;
  routeItem: (id: string) => void;
}

const IncentivizedPoolCard: React.FC<IncentivizedPoolCardProps> = ({
  pool,
  routeItem,
}) => {

  const pairName = useMemo(() => {
    return `${pool.tokenA.symbol}/${pool.tokenB.symbol}`;
  }, [pool.tokenA.symbol, pool.tokenB.symbol]);

  return (
    <PoolCardWrapper
      onClick={() => routeItem(pool.poolId)}
    >
      <div className="pool-container">
        <div className="title-container">
          <div className="box-header">
            <DoubleLogo left={pool.tokenA.logoURI} right={pool.tokenB.logoURI} />
            <span>{pairName}</span>
          </div>
          <div className="box-group">
            <Badge type={BADGE_TYPE.DARK_DEFAULT} text={SwapFeeTierInfoMap[pool.feeTier].rateStr} />
          </div>
        </div>
        <div className="list-wrapper">
          <div className="list-header">
            <span className="label-text">{POOL_CONTENT_TITLE.LIQUIDITY}</span>
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
        <div className="pool-content">
          <div className="pool-rate-wrapper">
            <span>{`1 ${pool.tokenA.symbol}`}</span>
            <IconSwap />
            <span>{`${pool.currentTick} ${pool.tokenB.symbol}`}</span>
          </div>
          <PoolGraph
            tokenA={pool.tokenA}
            tokenB={pool.tokenB}
            bins={pool.bins}
            currentTick={pool.currentTick}
            width={258}
            height={60}
            mouseover
          />
        </div>
      </div>
    </PoolCardWrapper>
  );
};

export default IncentivizedPoolCard;
