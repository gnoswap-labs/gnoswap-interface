"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRouteKey = void 0;
function makeRouteKey(route) {
    return route.pools.map(p => p.poolPath).join("*POOL*");
}
exports.makeRouteKey = makeRouteKey;
