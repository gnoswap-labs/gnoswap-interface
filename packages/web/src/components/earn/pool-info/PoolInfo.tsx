// TODO : remove eslint-disable after work
/* eslint-disable */
import BarGraph from "@components/common/bar-graph/BarGraph";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { POOL_TD_WIDTH } from "@constants/skeleton.constant";
import React, { useMemo } from "react";
import { PoolInfoWrapper, TableColumn } from "./PoolInfo.styles";
import { PoolListInfo } from "@models/pool/info/pool-list-info";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import PoolGraph from "@components/common/pool-graph/PoolGraph";
import POOLS from "@repositories/pool/mock/pools.json";
const POOL_DATA = POOLS.pools[0];
interface PoolInfoProps {
  pool: PoolListInfo;
  routeItem: (id: string) => void;
  themeKey: "dark" | "light";
}

const PoolInfo: React.FC<PoolInfoProps> = ({ pool, routeItem, themeKey }) => {
  const {
    poolId,
    tokenA,
    tokenB,
    feeTier,
    liquidity,
    apr,
    volume24h,
    fees24h,
    rewards,
    currentTick,
    bins,
  } = pool;

  const rewardImage = useMemo(() => {
    if (rewards.length === 0) {
      return <>-</>;
    }
    if (rewards.length === 1) {
      return <img src={rewards[0].token.logoURI} className="icon-reward" alt="icon reward" />;
    }
    return <DoubleLogo left={rewards[0].token.logoURI} right={rewards[1].token.logoURI} size={20} />;
  }, [rewards]);

  return (
    <PoolInfoWrapper
      onClick={() => routeItem(poolId)}
    >
      <TableColumn className="left" tdWidth={POOL_TD_WIDTH[0]}>
        <DoubleLogo
          left={tokenA.logoURI}
          right={tokenB.logoURI}
          size={20}
        />
        <span className="symbol-pair">{`${tokenA.symbol}/${tokenB.symbol}`}</span>
        <span className="feeRate">{SwapFeeTierInfoMap[feeTier].rateStr}</span>
      </TableColumn>
      <TableColumn tdWidth={POOL_TD_WIDTH[1]}>
        <span className="liquidity">{liquidity}</span>
      </TableColumn>
      <TableColumn tdWidth={POOL_TD_WIDTH[2]}>
        <span className="volume">{volume24h}</span>
      </TableColumn>
      <TableColumn tdWidth={POOL_TD_WIDTH[3]}>
        <span className="fees">{fees24h}</span>
      </TableColumn>
      <TableColumn tdWidth={POOL_TD_WIDTH[4]}>
        <span className="apr">{apr}</span>
      </TableColumn>
      <TableColumn tdWidth={POOL_TD_WIDTH[5]}>
        {rewardImage}
      </TableColumn>
      <TableColumn tdWidth={POOL_TD_WIDTH[6]}>
        <div className="chart-wrapper">
          <PoolGraph
            width={100}
            height={45}
            tokenA={tokenA}
            tokenB={tokenB}
            currentTick={currentTick}
            bins={POOL_DATA.bins}
            mouseover
            themeKey={themeKey}
          />
        </div>
      </TableColumn>
    </PoolInfoWrapper>
  );
};

export default PoolInfo;
