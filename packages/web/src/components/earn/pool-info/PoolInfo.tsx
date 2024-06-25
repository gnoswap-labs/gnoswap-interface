import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import React, { useMemo } from "react";
import { PoolInfoWrapper, TableColumn } from "./PoolInfo.styles";
import { PoolListInfo } from "@models/pool/info/pool-list-info";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import OverlapLogo from "@components/common/overlap-logo/OverlapLogo";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { DEVICE_TYPE } from "@styles/media";
import { numberToRate } from "@utils/string-utils";
import PoolInfoLazyChart from "../pool-info-lazy-chart/PoolInfoLazyChart";
import { POOL_INFO, POOL_INFO_MOBILE, POOL_INFO_SMALL_TABLET, POOL_INFO_TABLET } from "@constants/skeleton.constant";
import IconStar from "@components/common/icons/IconStar";

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
        symbol: getGnotPath(item).symbol,
      };
    });
    const temp = tempRewardTokens.map(token => ({ src: token.logoURI, tooltipContent: token.symbol }));
    const logos = [...new Set(temp)];
    return <OverlapLogo logos={logos} size={20} />;
  }, [getGnotPath, rewardTokens]);

  const cellWidths = breakpoint === DEVICE_TYPE.MOBILE
    ? POOL_INFO_MOBILE
    : breakpoint === DEVICE_TYPE.TABLET_M
      ? POOL_INFO_SMALL_TABLET
      : breakpoint === DEVICE_TYPE.TABLET
        ? POOL_INFO_TABLET
        : POOL_INFO;

  return (
    <PoolInfoWrapper onClick={() => routeItem(poolId)}>
      <TableColumn className="left" tdWidth={cellWidths.list[0].width}>
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
      <TableColumn tdWidth={cellWidths.list[1].width}>
        <span className="liquidity">{tvl}</span>
      </TableColumn>
      {/* Volume (24h) */}
      <TableColumn tdWidth={cellWidths.list[2].width}>
        <span className="volume">{volume24h}</span>
      </TableColumn>
      {/* Fee (24h) */}
      <TableColumn tdWidth={cellWidths.list[3].width}>
        <span className="fees">{fees24h}</span>
      </TableColumn>
      {/* APR */}
      <TableColumn tdWidth={cellWidths.list[4].width}>
        <span className="apr">
          {Number(apr) > 100 && <IconStar size={20} />}
          {numberToRate(apr)}
        </span>
      </TableColumn>
      <TableColumn tdWidth={cellWidths.list[5].width}>{rewardImage}</TableColumn>
      <TableColumn tdWidth={cellWidths.list[6].width} onClick={e => e.stopPropagation()}>
        <div className="chart-wrapper">
          <PoolInfoLazyChart pool={pool} width={cellWidths.list[6].skeletonWidth} />
        </div>
      </TableColumn>
    </PoolInfoWrapper>
  );
};

export default PoolInfo;
