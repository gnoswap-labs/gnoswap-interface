import React, { useMemo } from "react";
import { AutoRouterWrapper, DotLine } from "./SwapCardAutoRouter.styles";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { useTokenImage } from "@hooks/token/use-token-image";

interface ContentProps {
  swapRouteInfos: SwapRouteInfo[];
  swapSummaryInfo: SwapSummaryInfo;
}

const SwapCardAutoRouter: React.FC<ContentProps> = ({
  swapRouteInfos,
  swapSummaryInfo,
}) => {

  const bestGasFee = useMemo(() => {
    const totalGasFee = swapRouteInfos.reduce((prev, current) => prev + current.gasFeeUSD, 0);
    return `$${totalGasFee}`;
  }, [swapRouteInfos]);

  return (
    <AutoRouterWrapper>
      {swapRouteInfos.map((swapRouteInfo, index) => (
        <SwapCardAutoRouterItem key={index} swapRouteInfo={swapRouteInfo} swapSummaryInfo={swapSummaryInfo} />
      ))}
      <p className="gas-description">
        {`Best price route costs ~${bestGasFee} in gas. This route optimizes your total output by considering split routes, multiple hops, and the gas cost of each step.`}
      </p>
    </AutoRouterWrapper>
  );
};

interface SwapCardAutoRouterItemProps {
  swapRouteInfo: SwapRouteInfo;
  swapSummaryInfo: SwapSummaryInfo;
}

const SwapCardAutoRouterItem: React.FC<SwapCardAutoRouterItemProps> = ({
  swapRouteInfo,
  swapSummaryInfo,
}) => {
  const { getTokenImage } = useTokenImage();

  const weightStr = useMemo(() => {
    return `${swapRouteInfo.weight}%`;
  }, [swapRouteInfo.weight]);

  const routeInfos = useMemo(() => {
    let currentFromToken = swapSummaryInfo.tokenA.path;
    return swapRouteInfo.pools.map((pool) => {
      const ordered = currentFromToken === pool.tokenAPath;
      const fromToken = ordered ? pool.tokenAPath : pool.tokenBPath;
      const toToken = ordered ? pool.tokenBPath : pool.tokenAPath;
      currentFromToken = toToken;
      return {
        fee: `${(pool.fee / 10000).toFixed(2)}%`,
        fromToken,
        toToken
      };
    });
  }, [swapRouteInfo.pools, swapSummaryInfo.tokenA.path]);

  return (
    <div className="row">
      <img src={swapSummaryInfo.tokenA.logoURI} alt="token logo" className="token-logo" />
      <div className="left-box">
        <div className="left-badge">{swapRouteInfo.version}</div>
        <span>{weightStr}</span>
      </div>
      <DotLine />
      {routeInfos.map((routeInfo, index) => (
        <React.Fragment key={`pool-${index}`}>
          <div className="pair-fee">
            <DoubleLogo left={getTokenImage(routeInfo.fromToken) || ""} right={getTokenImage(routeInfo.toToken) || ""} size={16} />
            <h1>{routeInfo.fee}</h1>
          </div>
          <DotLine />
        </React.Fragment>
      ))}
      <img src={swapSummaryInfo.tokenB.logoURI} alt="token logo" className="token-logo" />
    </div>
  );
};


export default SwapCardAutoRouter;
