import { EstimatedRoute } from "../swap-router";
import { Pool } from "../swap-simulator";
import { sumBigInts } from "./array.util";

export function printEstimateRouteInfo(routes: EstimatedRoute[]) {
  const sumAmount = sumBigInts(routes.map(route => route.amountOut));
  const routeInfo = {
    routes: routes.map(route => ({
      key: route.routeKey,
      quote: route.quote,
    })),
    amount: sumAmount,
  };

  let prints = "\n";
  prints = "라우트 결과\n";
  routeInfo.routes.forEach(route => {
    prints += `- ${route.key} (${route.quote}%)\n\n`;
  });
  prints += `출력수량: ${routeInfo.amount.toString()}\n\n`;
  console.log(prints);

  let result = "\n";
  result += `routes: ${JSON.stringify(routeInfo.routes, null, 2)}\n\n`;
  result += `amount: ${routeInfo.amount.toString()}\n\n`;
  console.log(result);

  return routeInfo;
}

export function printPoolInfo(pools: Pool[]) {
  let result = "\n";
  pools.forEach(pool => {
    result += "POOL\n";
    result += `- poolPath: ${pool.poolPath}\n`;
    result += `- tokenAPath: ${pool.tokenAPath}\n`;
    result += `- tokenBPath: ${pool.tokenBPath}\n`;
    result += `- fee: ${pool.fee}\n`;
    result += `- tokenABalance: ${pool.tokenABalance.toString()}\n`;
    result += `- tokenBBalance: ${pool.tokenBBalance.toString()}\n`;
    result += `- tickSpacing: ${pool.tickSpacing}\n`;
    result += `- sqrtPriceX96: ${pool.sqrtPriceX96.toString()}\n`;
    result += `- tick: ${pool.tick}\n`;
    result += `- positions: [\n`;
    pool.positions.forEach(position => {
      result += `    {\n`;
      result += `      tickLower: ${position.tickLower}\n`;
      result += `      tickUpper: ${position.tickUpper}\n`;
      result += `      liquidity: ${position.liquidity.toString()}\n`;
      result += `    },\n`;
    });
    result += `]\n\n`;
  });
  console.log(result);
}
