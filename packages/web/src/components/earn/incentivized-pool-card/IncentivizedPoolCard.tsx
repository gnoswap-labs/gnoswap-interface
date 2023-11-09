import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconSwap from "@components/common/icons/IconSwap";
import { POOL_CONTENT_TITLE } from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import {
  PoolCardWrapper,
  PoolCardWrapperWrapperBorder,
} from "./IncentivizedPoolCard.styles";
import { PoolCardInfo } from "@models/pool/info/pool-card-info";
import { useMemo, useState } from "react";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { numberToFormat } from "@utils/string-utils";
import PoolGraph from "@components/common/pool-graph/PoolGraph";

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
  const [isSwap, setIsSwap] = useState(false);

  const pairName = useMemo(() => {
    return `${pool.tokenA.symbol}/${pool.tokenB.symbol}`;
  }, [pool.tokenA.symbol, pool.tokenB.symbol]);

  const handleClickSwap = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsSwap(!isSwap);
  };
  const swapValue = useMemo(() => {
    return isSwap ? numberToFormat(1 / pool.currentTick, 6) : pool.currentTick;
  }, [pool, isSwap]);

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
            <div className="pool-content">
              <div className="pool-rate-wrapper" onClick={handleClickSwap}>
                <span>{`1 ${
                  !isSwap ? pool.tokenA.symbol : pool.tokenB.symbol
                }`}</span>
                <IconSwap />
                <span>{`${swapValue} ${
                  isSwap ? pool.tokenA.symbol : pool.tokenB.symbol
                }`}</span>
              </div>
              <PoolGraph
                tokenA={pool.tokenA}
                tokenB={pool.tokenB}
                bins={pool.bins}
                currentTick={pool.currentTick}
                width={258}
                height={60}
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
