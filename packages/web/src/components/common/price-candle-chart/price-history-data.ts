export interface HistoryResponse<Candle> {
  interval: number;
  start: number;
  end: number;
  data: Candle[];
}

export function mapHistoryRows<Candle extends { start: string }, Result>(
  response: HistoryResponse<Candle>,
  interval: number,
  start: number,
  end: number,
  convert: (candle: Candle, time: number) => Result,
): Result[] {
  if (
    response?.interval !== interval ||
    response.start !== start ||
    response.end !== end ||
    !Array.isArray(response.data)
  ) {
    throw new Error("Invalid price history response");
  }
  let previous = -1;
  return response.data.map(candle => {
    const time = typeof candle?.start === "string" ? Date.parse(candle.start) / 1000 : NaN;
    if (
      !Number.isSafeInteger(time) ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.000)?Z$/.test(candle.start) ||
      new Date(time * 1000).toISOString().replace(/\.000Z$/, "Z") !== candle.start.replace(/\.000Z$/, "Z") ||
      time < start ||
      time >= end ||
      time % interval !== 0 ||
      time <= previous
    ) {
      throw new Error("Invalid price history response");
    }
    previous = time;
    return convert(candle, time);
  });
}

export const DECIMAL = /^(?:0|[1-9]\d*)(?:\.\d+)?$/;
