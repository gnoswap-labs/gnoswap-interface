import { Route } from "../swap-router.types";

export function makeRouteKey(route: Route) {
  return route.pools.map(p => p.poolPath).join("-");
}
