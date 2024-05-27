"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeSwapStep = exports.getAmountBDelta = exports.getAmountADelta = exports.getAmountBDeltaHelper = exports.getAmountADeltaHelper = exports.getNextSqrtPriceFromOutput = exports.getNextSqrtPriceFromInput = exports.getNextSqrtPriceFromAmountBRoundingDown = exports.getNextSqrtPriceFromAmountARoundingUp = void 0;
const constants_1 = require("../../constants");
function getNextSqrtPriceFromAmountARoundingUp(sqrtPriceX96, liquidity, amount, added) {
    if (amount === 0n) {
        return sqrtPriceX96;
    }
    const numerator1 = liquidity << 96n;
    const product = amount * sqrtPriceX96;
    let denominator = 0n;
    if (added) {
        if (product / amount == sqrtPriceX96) {
            denominator = numerator1 + product;
            if (denominator >= numerator1) {
                return (numerator1 * sqrtPriceX96) / denominator;
            }
        }
        return numerator1 / (numerator1 / sqrtPriceX96 + amount);
    }
    denominator = numerator1 - product;
    return (numerator1 * sqrtPriceX96) / denominator;
}
exports.getNextSqrtPriceFromAmountARoundingUp = getNextSqrtPriceFromAmountARoundingUp;
function getNextSqrtPriceFromAmountBRoundingDown(sqrtPriceX96, liquidity, amount, added) {
    let quotient = 0n;
    if (added) {
        if (amount <= constants_1.MAX_UINT160) {
            quotient = (amount << 96n) / liquidity;
        }
        else {
            quotient = (amount * constants_1.Q96) / liquidity;
        }
        return sqrtPriceX96 + quotient;
    }
    else {
        if (amount <= constants_1.MAX_UINT160) {
            quotient = (amount << 96n) / liquidity;
        }
        else {
            quotient = (amount * constants_1.Q96) / liquidity;
        }
        return sqrtPriceX96 - quotient;
    }
}
exports.getNextSqrtPriceFromAmountBRoundingDown = getNextSqrtPriceFromAmountBRoundingDown;
function getNextSqrtPriceFromInput(sqrtPriceX96, liquidity, amountIn, zeroForOne) {
    if (zeroForOne) {
        return getNextSqrtPriceFromAmountARoundingUp(sqrtPriceX96, liquidity, amountIn, true);
    }
    return getNextSqrtPriceFromAmountBRoundingDown(sqrtPriceX96, liquidity, amountIn, true);
}
exports.getNextSqrtPriceFromInput = getNextSqrtPriceFromInput;
function getNextSqrtPriceFromOutput(sqrtPriceX96, liquidity, amountOut, zeroForOne) {
    if (zeroForOne) {
        return getNextSqrtPriceFromAmountBRoundingDown(sqrtPriceX96, liquidity, amountOut, false);
    }
    return getNextSqrtPriceFromAmountARoundingUp(sqrtPriceX96, liquidity, amountOut, false);
}
exports.getNextSqrtPriceFromOutput = getNextSqrtPriceFromOutput;
function getAmountADeltaHelper(sqrtRatioAX96, sqrtRatioBX96, liquidity) {
    let changedSqrtRatioA = sqrtRatioAX96;
    let changedSqrtRatioB = sqrtRatioBX96;
    if (sqrtRatioAX96 > sqrtRatioBX96) {
        changedSqrtRatioA = sqrtRatioBX96;
        changedSqrtRatioB = sqrtRatioAX96;
    }
    const numerator1 = liquidity * constants_1.Q96;
    const numerator2 = changedSqrtRatioB - changedSqrtRatioA;
    return (numerator1 * numerator2) / (changedSqrtRatioA * changedSqrtRatioB);
}
exports.getAmountADeltaHelper = getAmountADeltaHelper;
function getAmountBDeltaHelper(sqrtRatioAX96, sqrtRatioBX96, liquidity) {
    let changedSqrtRatioA = sqrtRatioAX96;
    let changedSqrtRatioB = sqrtRatioBX96;
    if (sqrtRatioAX96 > sqrtRatioBX96) {
        changedSqrtRatioA = sqrtRatioBX96;
        changedSqrtRatioB = sqrtRatioAX96;
    }
    return ((changedSqrtRatioB - changedSqrtRatioA) * liquidity) / constants_1.Q96;
}
exports.getAmountBDeltaHelper = getAmountBDeltaHelper;
function getAmountADelta(sqrtRatioAX96, sqrtRatioBX96, liquidity) {
    if (liquidity < 0) {
        return -getAmountADeltaHelper(sqrtRatioAX96, sqrtRatioBX96, -liquidity);
    }
    return getAmountADeltaHelper(sqrtRatioAX96, sqrtRatioBX96, liquidity);
}
exports.getAmountADelta = getAmountADelta;
function getAmountBDelta(sqrtRatioAX96, sqrtRatioBX96, liquidity) {
    if (liquidity < 0) {
        return -getAmountBDeltaHelper(sqrtRatioAX96, sqrtRatioBX96, -liquidity);
    }
    return getAmountADeltaHelper(sqrtRatioAX96, sqrtRatioBX96, liquidity);
}
exports.getAmountBDelta = getAmountBDelta;
function computeSwapStep(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, amountRemaining, fee) {
    const exactIn = amountRemaining >= 0;
    const zeroForOne = sqrtRatioCurrentX96 >= sqrtRatioTargetX96;
    let amountIn = 0n;
    let amountOut = 0n;
    let sqrtRatioNextX96 = 0n;
    if (exactIn) {
        const amountRemainingLessFee = (amountRemaining * (1000000n - BigInt(fee))) / 1000000n;
        if (zeroForOne) {
            amountIn = getAmountADeltaHelper(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity);
        }
        else {
            amountIn = getAmountBDeltaHelper(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity);
        }
        if (amountRemainingLessFee >= amountIn) {
            sqrtRatioNextX96 = sqrtRatioTargetX96;
        }
        else {
            sqrtRatioNextX96 = getNextSqrtPriceFromInput(sqrtRatioCurrentX96, liquidity, amountRemainingLessFee, zeroForOne);
        }
    }
    else {
        if (zeroForOne) {
            amountOut = getAmountBDeltaHelper(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity);
        }
        else {
            amountOut = getAmountADeltaHelper(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity);
        }
        const positiveAmountRemaining = amountRemaining >= 0 ? amountRemaining : amountRemaining * -1n;
        if (positiveAmountRemaining >= amountOut) {
            sqrtRatioNextX96 = sqrtRatioTargetX96;
        }
        else {
            sqrtRatioNextX96 = getNextSqrtPriceFromOutput(sqrtRatioCurrentX96, liquidity, positiveAmountRemaining, zeroForOne);
        }
    }
    const max = sqrtRatioTargetX96 === sqrtRatioNextX96;
    if (zeroForOne) {
        if (!max || !exactIn) {
            amountIn = getAmountADeltaHelper(sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity);
        }
        if (!max || exactIn) {
            amountOut = getAmountBDeltaHelper(sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity);
        }
    }
    else {
        if (!max || !exactIn) {
            amountIn = getAmountBDeltaHelper(sqrtRatioCurrentX96, sqrtRatioNextX96, liquidity);
        }
        if (!max || exactIn) {
            amountOut = getAmountADeltaHelper(sqrtRatioCurrentX96, sqrtRatioNextX96, liquidity);
        }
    }
    const positiveAmountRemaining = amountRemaining >= 0 ? amountRemaining : amountRemaining * -1n;
    if (!exactIn && amountOut > positiveAmountRemaining) {
        amountOut = positiveAmountRemaining;
    }
    let feeAmount = 0n;
    if (exactIn && sqrtRatioNextX96 !== sqrtRatioTargetX96) {
        feeAmount = amountRemaining - amountIn;
    }
    else {
        feeAmount = (amountIn * BigInt(fee)) / (1000000n - BigInt(fee));
    }
    return {
        sqrtRatioNextX96,
        amountIn,
        amountOut,
        feeAmount,
    };
}
exports.computeSwapStep = computeSwapStep;
