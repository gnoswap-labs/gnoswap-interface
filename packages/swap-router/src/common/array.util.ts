export function sum(arr: number[]) {
  return arr.reduce((accum, current) => current + accum, 0);
}
