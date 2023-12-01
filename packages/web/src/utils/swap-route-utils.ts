import { EstimatedRoute } from "@gnoswap-labs/swap-router";

export function makeRoutesQuery(routes: EstimatedRoute[], fromPath: string) {
  const POOL_DIVIDER = "*POOL*";
  return routes
    .map(route => {
      let curreentFromPath = fromPath;
      return route.pools
        .map(pool => {
          const { tokenAPath, tokenBPath, fee } = pool;
          const ordered = curreentFromPath === tokenAPath;
          const inputTokenPath = ordered ? tokenAPath : tokenBPath;
          const outputTokenPath = ordered ? tokenBPath : tokenAPath;
          curreentFromPath = outputTokenPath;
          return `${inputTokenPath}:${outputTokenPath}:${fee}`;
        })
        .join(POOL_DIVIDER);
    })
    .join(",");
}
