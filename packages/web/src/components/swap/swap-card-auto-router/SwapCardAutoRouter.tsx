import React, { useMemo } from "react";
import {
  AutoRoutePoolInfoWrapper,
  AutoRouterWrapper,
  DotLine,
} from "./SwapCardAutoRouter.styles";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { useTokenImage } from "@hooks/token/use-token-image";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import Tooltip from "@components/common/tooltip/Tooltip";

interface ContentProps {
  swapRouteInfos: SwapRouteInfo[];
  swapSummaryInfo: SwapSummaryInfo;
  isLoading: boolean;
}

const SwapCardAutoRouter: React.FC<ContentProps> = ({
  swapRouteInfos,
  swapSummaryInfo,
  isLoading,
}) => {
  const bestGasFee = useMemo(() => {
    const totalGasFee = swapRouteInfos.reduce(
      (prev, current) => prev + current.gasFeeUSD,
      0,
    );

    if (totalGasFee < 0.01) {
      return "<$0.01";
    }
    return `~$${totalGasFee}`;
  }, [swapRouteInfos]);

  return (
    <AutoRouterWrapper>
      {isLoading ? (
        <LoadingSpinner className="loading-spin" />
      ) : (
        <>
          {swapRouteInfos.map((swapRouteInfo, index) => (
            <SwapCardAutoRouterItem
              key={index}
              swapRouteInfo={swapRouteInfo}
              swapSummaryInfo={swapSummaryInfo}
            />
          ))}
          <p className="gas-description">
            {`Best price route costs ${bestGasFee} in gas. This route optimizes your total output by considering split routes, multiple hops, and the gas cost of each step.`}
          </p>
        </>
      )}
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
  const { getTokenImage, getTokenSymbol } = useTokenImage();

  const weightStr = useMemo(() => {
    return `${swapRouteInfo.weight}%`;
  }, [swapRouteInfo.weight]);

  const routeInfos = useMemo(() => {
    let currentFromToken = swapSummaryInfo.tokenA.path;

    return swapRouteInfo.pools.map(pool => {
      const ordered = currentFromToken === pool.tokenA;
      const fromToken = ordered ? pool.tokenA : pool.tokenB;
      const toToken = ordered ? pool.tokenB : pool.tokenA;
      const poolInfos = pool.poolPath.split(":");
      const fee = poolInfos.length > 2 ? poolInfos[2] : "100";
      currentFromToken = toToken;

      return {
        fee: `${(Number(fee) / 10000).toFixed(2)}%`,
        fromToken,
        toToken,
      };
    });
  }, [swapRouteInfo.pools, swapSummaryInfo.tokenA.path]);

  return (
    <div className="row">
      <MissingLogo
        symbol={swapSummaryInfo.tokenA.symbol}
        url={swapSummaryInfo.tokenA.logoURI}
        className="token-logo"
        width={24}
        mobileWidth={24}
      />
      <div className="left-box">
        {/* {routeInfos.length < 3 && <div className="left-badge">{swapRouteInfo.version}</div>} */}
        <span>{weightStr}</span>
      </div>
      <DotLine />
      {routeInfos.map((routeInfo, index) => (
        <React.Fragment key={`pool-${index}`}>
          <Tooltip
            placement="top"
            FloatingContent={
              <AutoRoutePoolInfoWrapper>
                {getTokenSymbol(routeInfo.fromToken)}
                {"/"}
                {getTokenSymbol(routeInfo.toToken)} {routeInfo.fee}
              </AutoRoutePoolInfoWrapper>
            }
          >
            <div className="pair-fee">
              <DoubleLogo
                left={getTokenImage(routeInfo.fromToken) || ""}
                right={getTokenImage(routeInfo.toToken) || ""}
                size={16}
                leftSymbol={getTokenSymbol(routeInfo.fromToken) || ""}
                rightSymbol={getTokenSymbol(routeInfo.toToken) || ""}
              />
              <h1>{routeInfo.fee}</h1>
            </div>
          </Tooltip>
          {index < 2 && <DotLine />}
        </React.Fragment>
      ))}
      <MissingLogo
        symbol={swapSummaryInfo.tokenB.symbol}
        url={swapSummaryInfo.tokenB.logoURI}
        className="token-logo"
        width={24}
        mobileWidth={24}
      />
    </div>
  );
};

export default SwapCardAutoRouter;
