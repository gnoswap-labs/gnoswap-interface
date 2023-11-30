export function sum(arr: number[]) {
  return arr.reduce((accum, current) => current + accum, 0);
}

export function sumBigInts(arr: bigint[]) {
  return arr.reduce((accum, current) => current + accum, 0n);
}
