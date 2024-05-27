"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LSB = exports.MSB = exports.fromSqrtX96 = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const constants_1 = require("../../constants");
function fromSqrtX96(value) {
    return (0, bignumber_js_1.default)(`${value}`).dividedBy(constants_1.Q96.toString()).sqrt().toNumber();
}
exports.fromSqrtX96 = fromSqrtX96;
function MSB(x) {
    let r = 0n;
    let calculated = BigInt(x);
    if (calculated >= 0x100000000000000000000000000000000n) {
        calculated >>= 128n;
        r += 128n;
    }
    if (calculated >= 0x10000000000000000n) {
        calculated >>= 64n;
        r += 64n;
    }
    if (calculated >= 0x100000000n) {
        calculated >>= 32n;
        r += 32n;
    }
    if (calculated >= 0x10000n) {
        calculated >>= 16n;
        r += 16n;
    }
    if (calculated >= 0x100n) {
        calculated >>= 8n;
        r += 8n;
    }
    if (calculated >= 0x10n) {
        calculated >>= 4n;
        r += 4n;
    }
    if (calculated >= 0x4n) {
        calculated >>= 2n;
        r += 2n;
    }
    if (calculated >= 0x2n) {
        r += 1n;
    }
    return r;
}
exports.MSB = MSB;
function LSB(x) {
    let r = 255n;
    let calculated = BigInt(x);
    if ((calculated & constants_1.MAX_UINT128) > 0n) {
        r -= 128n;
    }
    else {
        calculated >>= 128n;
    }
    if ((calculated & constants_1.MAX_UINT64) > 0n) {
        r -= 64n;
    }
    else {
        calculated >>= 64n;
    }
    if ((calculated & constants_1.MAX_UINT32) > 0n) {
        r -= 32n;
    }
    else {
        calculated >>= 32n;
    }
    if ((calculated & constants_1.MAX_UINT16) > 0n) {
        r -= 16n;
    }
    else {
        calculated >>= 16n;
    }
    if ((calculated & constants_1.MAX_UINT8) > 0n) {
        r -= 8n;
    }
    else {
        calculated >>= 8n;
    }
    if ((calculated & 0xfn) > 0) {
        r -= 4n;
    }
    else {
        calculated >>= 4n;
    }
    if ((calculated & 0x3n) > 0) {
        r -= 2n;
    }
    else {
        calculated >>= 2n;
    }
    if ((calculated & 0x1n) > 0) {
        r -= 1n;
    }
    return r;
}
exports.LSB = LSB;
