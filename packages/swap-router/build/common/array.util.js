"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumBigInts = exports.sum = void 0;
function sum(arr) {
    return arr.reduce((accum, current) => current + accum, 0);
}
exports.sum = sum;
function sumBigInts(arr) {
    return arr.reduce((accum, current) => current + accum, 0n);
}
exports.sumBigInts = sumBigInts;
