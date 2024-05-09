// TODO : remove eslint-disable after work
/* eslint-disable */
import BarGraph from "@components/common/bar-graph/BarGraph";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import {
  POOL_TD_WIDTH,
  POOL_TD_WIDTH_MOBILE,
  POOL_TD_WIDTH_SMALL_TABLET,
  POOL_TD_WIDTH_TABLET,
} from "@constants/skeleton.constant";
import React, { useMemo } from "react";
import { PoolInfoWrapper, TableColumn } from "./PoolInfo.styles";
import { PoolListInfo } from "@models/pool/info/pool-list-info";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import PoolGraph from "@components/common/pool-graph/PoolGraph";
import TokenLogo from "@components/common/token-logo/TokenLogo";
import DoubleTokenLogo from "@components/common/double-token-logo/DoubleTokenLogo";
import OverlapLogo from "@components/common/overlap-logo/OverlapLogo";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { DEVICE_TYPE } from "@styles/media";

interface PoolInfoProps {
  pool: PoolListInfo;
  routeItem: (id: string) => void;
  themeKey: "dark" | "light";
  breakpoint: DEVICE_TYPE;
}

const PoolInfo: React.FC<PoolInfoProps> = ({
  pool,
  routeItem,
  themeKey,
  breakpoint,
}) => {
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
    price,
  } = pool;
  const { getGnotPath } = useGnotToGnot();
  const rewardImage = useMemo(() => {
    const tempRewardTokens = rewardTokens.map(item => {
      return {
        ...item,
        logoURI: getGnotPath(item).logoURI,
      };
    });
    const temp = tempRewardTokens.map(token => token.logoURI);
    const logos = [...new Set(temp)];
    return <OverlapLogo logos={logos} size={20} />;
  }, [rewardTokens, tokenA, tokenB]);

  // const resolvedBins = useMemo(() => {
  //   const length = 20;
  //   const poolLength = pool.bins.length;
  //   if (poolLength <= 20) return pool?.bins || [];
  //   return Array.from({ length }, (_, index) => {
  //     if (index + 10 > poolLength - 1) return pool.bins[0];
  //     return pool.bins[10 + index];
  //   });
  // }, [pool.bins]);

  const tdWidth =
    breakpoint === DEVICE_TYPE.MOBILE
      ? POOL_TD_WIDTH_MOBILE
      : breakpoint === DEVICE_TYPE.TABLET_M
        ? POOL_TD_WIDTH_SMALL_TABLET
        : breakpoint === DEVICE_TYPE.TABLET
          ? POOL_TD_WIDTH_TABLET
          : POOL_TD_WIDTH;

  return (
    <PoolInfoWrapper onClick={() => routeItem(poolId)}>
      <TableColumn className="left" tdWidth={tdWidth[0]}>
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
      <TableColumn tdWidth={tdWidth[1]}>
        <span className="liquidity">{liquidity}</span>
      </TableColumn>
      <TableColumn tdWidth={tdWidth[2]}>
        <span className="volume">{volume24h}</span>
      </TableColumn>
      <TableColumn tdWidth={tdWidth[3]}>
        <span className="fees">{fees24h}</span>
      </TableColumn>
      <TableColumn tdWidth={tdWidth[4]}>
        <span className="apr">{apr}</span>
      </TableColumn>
      <TableColumn tdWidth={tdWidth[5]}>{rewardImage}</TableColumn>
      <TableColumn tdWidth={tdWidth[6]} onClick={e => e.stopPropagation()}>
        <div className="chart-wrapper">
          <PoolGraph
            width={100}
            height={45}
            tokenA={tokenA}
            tokenB={tokenB}
            currentTick={pool.currentTick}
            bins={bins ?? []}
            mouseover
            showBar={!pool.liquidity || pool.liquidity === "$0" || pool.liquidity === "0"}
            themeKey={themeKey}
            position="top"
            nextSpacing
            poolPrice={Number(price)}
          />
        </div>
      </TableColumn>
    </PoolInfoWrapper>
  );
};

export default PoolInfo;
