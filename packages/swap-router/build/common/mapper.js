"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePoolsByRPC = exports.makePool = void 0;
const swap_simulator_1 = require("../swap-simulator");
function makePool(data) {
    const responseData = data;
    const sqrtPriceX96 = BigInt(responseData.sqrt_price_x96);
    const price = (0, swap_simulator_1.fromSqrtX96)(data.sqrt_price_x96);
    return {
        poolPath: responseData.pool_path,
        tokenAPath: responseData.token0_path,
        tokenBPath: responseData.token1_path,
        fee: responseData.fee,
        tokenABalance: BigInt(responseData.token0_balance),
        tokenBBalance: BigInt(responseData.token1_balance),
        tickSpacing: responseData.tick_spacing,
        maxLiquidityPerTick: responseData.max_liquidity_per_tick,
        price,
        sqrtPriceX96,
        tick: responseData.tick,
        feeProtocol: responseData.fee_protocol,
        tokenAProtocolFee: responseData.token0_protocol_fee,
        tokenBProtocolFee: responseData.token1_protocol_fee,
        liquidity: BigInt(responseData.liquidity),
        ticks: responseData.ticks,
        tickBitmaps: Object.entries(responseData.tick_bitmaps).reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {}),
        positions: responseData.positions.map((position) => ({
            liquidity: BigInt(position.liquidity),
            owner: position.owner,
            tickLower: position.tick_lower,
            tickUpper: position.tick_upper,
            tokenAOwed: BigInt(position.token0_owed),
            tokenBOwed: BigInt(position.token1_owed),
        })),
    };
}
exports.makePool = makePool;
function makePoolsByRPC(pools) {
    return pools.map(makePool);
}
exports.makePoolsByRPC = makePoolsByRPC;
