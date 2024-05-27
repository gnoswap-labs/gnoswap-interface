"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCacheKey = void 0;
function makeCacheKey(pool, exactType, zeroForOne) {
    const { poolPath } = pool;
    return `${poolPath}${exactType}${zeroForOne}`;
}
exports.makeCacheKey = makeCacheKey;
