"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multipliedToBigint = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
function multipliedToBigint(num1, num2) {
    const calculated = (0, bignumber_js_1.default)(num1.toString())
        .multipliedBy(num2.toString())
        .toFixed(0);
    return BigInt(calculated);
}
exports.multipliedToBigint = multipliedToBigint;
