// TODO : remove eslint-disable after work
/* eslint-disable */
import BarGraph from "@components/common/bar-graph/BarGraph";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { POOL_TD_WIDTH } from "@constants/skeleton.constant";
import { type Pool } from "@containers/pool-list-container/PoolListContainer";
import React from "react";
import { PoolInfoWrapper, TableColumn } from "./PoolInfo.styles";
interface PoolInfoProps {
  pool: Pool;
  routeItem: (id: number) => void;
}

const PoolInfo: React.FC<PoolInfoProps> = ({ pool, routeItem }) => {
  const {
    poolId,
    tokenPair,
    feeRate,
    liquidity,
    apr,
    volume24h,
    fees24h,
    rewards,
    incentiveType,
    tickInfo
  } = pool;
  return (
    <PoolInfoWrapper
      onClick={() => routeItem(Math.floor(Math.random() * 100 + 1))}
    >
      <TableColumn className="left" tdWidth={POOL_TD_WIDTH[0]}>
        <DoubleLogo
          left={tokenPair.tokenA.logoURI}
          right={tokenPair.tokenB.logoURI}
          size={20}
        />
        <span className="symbol-pair">{`${tokenPair.tokenA.symbol}/${tokenPair.tokenB.symbol}`}</span>
        <span className="feeRate">{feeRate}</span>
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
        <DoubleLogo left={rewards[0]} right={rewards[1]} size={20} />
      </TableColumn>
      <TableColumn tdWidth={POOL_TD_WIDTH[6]}>
        <div className="chart-wrapper">
          <BarGraph
            width={100}
            height={45}
            currentTick={tickInfo.currentTick}
            datas={tickInfo.ticks}
          />
        </div>
      </TableColumn>
    </PoolInfoWrapper>
  );
};

export default PoolInfo;
