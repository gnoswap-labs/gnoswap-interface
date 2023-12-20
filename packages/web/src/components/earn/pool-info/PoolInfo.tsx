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
import TokenLogo from "@components/common/token-logo/TokenLogo";
import DoubleTokenLogo from "@components/common/double-token-logo/DoubleTokenLogo";
import OverlapLogo from "@components/common/overlap-logo/OverlapLogo";

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
    rewardTokens,
    currentTick,
    bins,
  } = pool;

  const rewardImage = useMemo(() => {
    if (rewardTokens.length === 0) {
      return <>-</>;
    }
    const logos = rewardTokens.map(token => token.logoURI);
    return <OverlapLogo logos={logos} size={20} />
  }, [rewardTokens]);

  const resolvedBins = useMemo(() => {
    const length = 20;
    if (pool.bins.length <= length) {
      return pool.bins;
    }
    const resolvedRate = pool.bins.length / length;
    return Array.from({ length }, (_, index) => {
      const pickIndex = Math.round((index + 1) * resolvedRate) - 1;
      return pool.bins[pickIndex];
    })
  }, [pool.bins]);

  return (
    <PoolInfoWrapper
      onClick={() => routeItem(poolId)}
    >
      <TableColumn className="left" tdWidth={POOL_TD_WIDTH[0]}>
        <DoubleLogo
          left={tokenA.logoURI}
          right={tokenB.logoURI}
          size={24}
          leftSymbol={tokenA.symbol}
          rightSymbol={tokenB.symbol}
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
            currentTick={pool.currentTick}
            bins={resolvedBins}
            mouseover
            themeKey={themeKey}
            position="top"
          />
        </div>
      </TableColumn>
    </PoolInfoWrapper>
  );
};

export default PoolInfo;
