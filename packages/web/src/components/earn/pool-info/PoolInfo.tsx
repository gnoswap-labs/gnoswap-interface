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
import OverlapLogo from "@components/common/overlap-logo/OverlapLogo";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { DEVICE_TYPE } from "@styles/media";
import { numberToRate } from "@utils/string-utils";
import PoolInfoLazyChart from "../pool-info-lazy-chart/PoolInfoLazyChart";

interface PoolInfoProps {
  pool: PoolListInfo;
  routeItem: (id: string) => void;
  themeKey: "dark" | "light";
  breakpoint: DEVICE_TYPE;
}

const PoolInfo: React.FC<PoolInfoProps> = ({ pool, routeItem, breakpoint }) => {
  const {
    poolId,
    tokenA,
    tokenB,
    feeTier,
    apr,
    volume24h,
    fees24h,
    rewardTokens,
    tvl,
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
  }, [rewardTokens]);

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
      {/* TVL */}
      <TableColumn tdWidth={tdWidth[1]}>
        <span className="liquidity">{tvl}</span>
      </TableColumn>
      {/* Volume (24h) */}
      <TableColumn tdWidth={tdWidth[2]}>
        <span className="volume">{volume24h}</span>
      </TableColumn>
      {/* Fee (24h) */}
      <TableColumn tdWidth={tdWidth[3]}>
        <span className="fees">{fees24h}</span>
      </TableColumn>
      {/* APR */}
      <TableColumn tdWidth={tdWidth[4]}>
        <span className="apr">{numberToRate(apr)}</span>
      </TableColumn>
      <TableColumn tdWidth={tdWidth[5]}>{rewardImage}</TableColumn>
      <TableColumn tdWidth={tdWidth[6]} onClick={e => e.stopPropagation()}>
        <div className="chart-wrapper">
          <PoolInfoLazyChart pool={pool} width={tdWidth[6]} />
        </div>
      </TableColumn>
    </PoolInfoWrapper>
  );
};

export default PoolInfo;
