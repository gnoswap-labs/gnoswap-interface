// TODO : remove eslint-disable after work
/* eslint-disable */
import BarGraph from "@components/common/bar-graph/BarGraph";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { POOL_TD_WIDTH } from "@constants/skeleton.constant";
import React, { useMemo } from "react";
import { PoolInfoWrapper, TableColumn } from "./PoolInfo.styles";
import { PoolListInfo } from "@models/pool/info/pool-list-info";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
interface PoolInfoProps {
  pool: PoolListInfo;
  routeItem: (id: string) => void;
}

const PoolInfo: React.FC<PoolInfoProps> = ({ pool, routeItem }) => {
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
    tickInfo
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
          <BarGraph
            width={100}
            height={45}
            currentTick={tickInfo.currentTick}
            datas={["1", "1", "2", "2", "3", "3", "2", "2", "1", "1"]}
            tooltipOption="incentivized"
            svgColor="incentivized"
          />
        </div>
      </TableColumn>
    </PoolInfoWrapper>
  );
};

export default PoolInfo;
