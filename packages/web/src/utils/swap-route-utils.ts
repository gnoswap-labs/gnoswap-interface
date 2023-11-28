import { RouteModel } from "@models/swap/route-model";

export function makeRoutesQuery(routes: RouteModel[]) {
  const POOL_DIVIDER = "*POOL*";
  return routes
    .map(route => route.pools.map(pool => pool.poolPath).join(POOL_DIVIDER))
    .join(",");
}
