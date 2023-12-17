import React, { useEffect, useMemo, useState } from "react";
import { AutoRouterWrapper, BalanceWrapper, DotLine } from "./SwapCardAutoRouter.styles";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { useTokenImage } from "@hooks/token/use-token-image";
import { Route } from "@gnoswap-labs/swap-router";
import Tooltip from "@components/common/tooltip/Tooltip";
import BigNumber from "bignumber.js";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { evaluateExpressionToNumber, makeABCIParams } from "@utils/rpc-utils";
import { makeRawTokenAmount } from "@utils/token-utils";

interface ContentProps {
  swapTokenInfo: SwapTokenInfo;
  route: Route;
}

const SwapCardEstimateRouter: React.FC<ContentProps> = ({
  swapTokenInfo,
  route,
}) => {

  return (
    <AutoRouterWrapper>
      <SwapCardAutoRouterItem swapTokenInfo={swapTokenInfo} route={route} />
    </AutoRouterWrapper>
  );
};

interface SwapCardAutoRouterItemProps {
  swapTokenInfo: SwapTokenInfo;
  route: Route;
}

const SwapCardAutoRouterItem: React.FC<SwapCardAutoRouterItemProps> = ({
  swapTokenInfo,
  route,
}) => {
  const [result, setResult] = useState("");
  const { getTokenImage } = useTokenImage();
  const { rpcProvider } = useGnoswapContext();

  useEffect(() => {
    setResult("");
  }, [swapTokenInfo]);

  const updateResult = () => {
    if (!swapTokenInfo.tokenA || !swapTokenInfo.tokenB || !rpcProvider) {
      return;
    }
    const fromToken = swapTokenInfo.tokenA;
    const toToken = swapTokenInfo.tokenB;
    let curreentFromPath = swapTokenInfo.tokenA?.wrappedPath;
    const routesQuery = route.pools
      .map(pool => {
        const { tokenAPath, tokenBPath, fee } = pool;
        const ordered = curreentFromPath === tokenAPath;
        const inputTokenPath = ordered ? tokenAPath : tokenBPath;
        const outputTokenPath = ordered ? tokenBPath : tokenAPath;
        curreentFromPath = outputTokenPath;
        return `${inputTokenPath}:${outputTokenPath}:${fee}`;
      }).join("*POOL*");
    const quotes = "100";
    const tokenAmount = swapTokenInfo.direction === "EXACT_IN" ? swapTokenInfo.tokenAAmount : swapTokenInfo.tokenBAmount;
    const param = makeABCIParams("DrySwapRoute", [
      fromToken.wrappedPath || "",
      toToken.wrappedPath || "",
      makeRawTokenAmount(fromToken, tokenAmount)?.toString() || "0",
      swapTokenInfo.direction,
      routesQuery,
      quotes,
    ]);
    rpcProvider
      .evaluateExpression("gno.land/r/demo/router", param)
      .then(evaluateExpressionToNumber)
      .then(result => setResult(`${result}`));
  };

  const routeInfos = useMemo(() => {
    return route.pools.map((pool) => {
      const fromToken = pool.tokenAPath;
      const toToken = pool.tokenBPath;
      const liquidity = pool.liquidity;
      const fromTokenBalance = BigNumber(pool.tokenABalance.toString()).shiftedBy(-6).toNumber();
      const toTokenBalance = BigNumber(pool.tokenBBalance.toString()).shiftedBy(-6).toNumber();
      return {
        fee: `${(pool.fee / 10000).toFixed(2)}%`,
        fromToken,
        toToken,
        fromTokenBalance,
        toTokenBalance,
        price: pool.price,
        liquidity
      };
    });
  }, [route.pools]);

  return (
    <div className="row">
      <div className="left-box">
        <div className="left-badge" onClick={updateResult}>{"FETCH"}</div>
        <span>{result}</span>
      </div>
      <DotLine />
      {routeInfos.map((routeInfo, index) => (
        <React.Fragment key={`pool-${index}`}>
          <Tooltip placement="top" FloatingContent={(
            <BalanceWrapper>
              <span>{`Price: ${routeInfo.price}`}</span>
              <span>{`Liquidity: ${routeInfo.liquidity}`}</span>
              <span>-</span>
              <span>{`${routeInfo.fromToken.replace("gno.land/r/demo/", "")}: ${routeInfo.fromTokenBalance}`}</span>
              <span>{`${routeInfo.toToken.replace("gno.land/r/demo/", "")}: ${routeInfo.toTokenBalance}`}</span>
            </BalanceWrapper>
          )}
          >
            <div className="pair-fee">
              <DoubleLogo left={getTokenImage(routeInfo.fromToken) || ""} right={getTokenImage(routeInfo.toToken) || ""} size={16} />
              <h1>{routeInfo.fee}</h1>
            </div>
          </Tooltip>
          <DotLine />
        </React.Fragment>
      ))}
    </div>
  );
};


export default SwapCardEstimateRouter;
