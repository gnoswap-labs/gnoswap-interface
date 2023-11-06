import React, { useMemo } from "react";
import { AutoRouterWrapper, DotLine } from "./SwapCardAutoRouter.styles";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";

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
  const weightStr = useMemo(() => {
    return `${swapRouteInfo.weight}%`;
  }, [swapRouteInfo.weight]);

  return (
    <div className="row">
      <img src={swapSummaryInfo.tokenA.logoURI} alt="token logo" className="token-logo" />
      <div className="left-box">
        <div className="left-badge">{swapRouteInfo.version}</div>
        <span>{weightStr}</span>
      </div>
      <DotLine />
      {swapRouteInfo.pools.map((pool, index) => (
        <>
          <div key={`pool-${index}`} className="pair-fee">
            <DoubleLogo left={pool.tokenA.logoURI} right={pool.tokenB.logoURI} size={16} />
            <h1>{pool.fee}</h1>
          </div>
          <DotLine key={`line-${index}`} />
        </>
      ))}
      <img src={swapSummaryInfo.tokenB.logoURI} alt="token logo" className="token-logo" />
    </div>
  );
};


export default SwapCardAutoRouter;
