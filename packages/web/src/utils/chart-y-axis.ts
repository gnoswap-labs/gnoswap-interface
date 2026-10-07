import BigNumber from "bignumber.js";

const SINGLE_DIGIT_SCALE_BASES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const Y_AXIS_LABEL_COUNT = 6;
const Y_AXIS_STEP_COUNT = Y_AXIS_LABEL_COUNT - 1;

export interface ChartYAxisInfo {
  labels: string[];
  minValue: string;
  maxValue: string;
}

function findAllowedScaleUnit(threshold: BigNumber, inclusive = true): BigNumber {
  const thresholdNumber = threshold.toNumber();
  if (!isFinite(thresholdNumber) || thresholdNumber <= 0) {
    return new BigNumber(1);
  }

  const startExponent = Math.floor(Math.log10(thresholdNumber)) - 1;
  for (let exponent = startExponent; exponent <= startExponent + 4; exponent++) {
    const magnitude = new BigNumber(10).pow(exponent);
    for (const base of SINGLE_DIGIT_SCALE_BASES) {
      const candidate = magnitude.multipliedBy(base);
      const satisfiesThreshold = inclusive
        ? candidate.isGreaterThanOrEqualTo(threshold)
        : candidate.isGreaterThan(threshold);
      if (satisfiesThreshold) return candidate;
    }
  }

  return new BigNumber(1);
}

function roundToMultiple(value: BigNumber, unit: BigNumber, mode: "ceil" | "floor"): BigNumber {
  if (unit.isZero()) return value;
  const roundingMode = mode === "ceil" ? BigNumber.ROUND_CEIL : BigNumber.ROUND_FLOOR;
  return value.dividedBy(unit).integerValue(roundingMode).multipliedBy(unit);
}

function trimTrailingZeros(value: string): string {
  return value
    .replace(/(\.\d*?[1-9])0+$/g, "$1")
    .replace(/\.0+$/g, "")
    .replace(/\.$/g, "");
}

export function truncateToSignificantDigits(value: BigNumber, significantDigits: number): string {
  if (!value.isFinite() || value.isZero()) return "0";

  const negative = value.isNegative();
  const absoluteValue = value.abs();
  const exponent = absoluteValue.e ?? 0;
  const decimalPlaces = Math.max(significantDigits - exponent - 1, 0);
  const factor = new BigNumber(10).pow(decimalPlaces);
  const truncated = absoluteValue.multipliedBy(factor).integerValue(BigNumber.ROUND_FLOOR).dividedBy(factor);
  const normalized = trimTrailingZeros(truncated.toFixed(decimalPlaces));

  return negative ? `-${normalized}` : normalized;
}

export function formatSubUnitChartValue(value: BigNumber | string | number): string {
  return truncateToSignificantDigits(new BigNumber(value), 3);
}

export function getYAxisInfo(datas: string[], tokenPrice?: number): ChartYAxisInfo {
  // Keep the same three-significant-digit format used by the token detail chart
  // for prices below one, while preserving fixed decimals for larger prices.
  const useSignificantFormat = tokenPrice !== undefined && tokenPrice < 1;

  const formatYAxisValue = (value: BigNumber, scaleUnit?: BigNumber) => {
    if (useSignificantFormat) {
      return formatSubUnitChartValue(value);
    }

    const unitDecimals = scaleUnit ? Math.max(0, -(scaleUnit.e ?? 0)) : 0;
    const decimals = Math.max(2, unitDecimals);
    return value.toFixed(decimals);
  };

  const numericDatas = datas.map(item => new BigNumber(item)).filter(item => !item.isNaN());

  if (numericDatas.length === 0) {
    return {
      labels: new Array(Y_AXIS_LABEL_COUNT).fill(formatYAxisValue(new BigNumber(0))),
      minValue: "0",
      maxValue: "0",
    };
  }

  const lowest = BigNumber.min(...numericDatas);
  const highest = BigNumber.max(...numericDatas);

  if (highest.isZero() && lowest.isZero()) {
    return {
      labels: new Array(Y_AXIS_LABEL_COUNT).fill(formatYAxisValue(new BigNumber(0))),
      minValue: "0",
      maxValue: "0",
    };
  }

  const targetMax = highest.multipliedBy(1.2);
  const targetMin = lowest.multipliedBy(0.8);
  const targetRange = targetMax.minus(targetMin);

  let scaleUnit = findAllowedScaleUnit(targetRange.dividedBy(Y_AXIS_STEP_COUNT));

  let maxPoint = roundToMultiple(targetMax, scaleUnit, "ceil");
  let minPoint = roundToMultiple(targetMin, scaleUnit, "floor");
  let actualSteps = maxPoint.minus(minPoint).dividedBy(scaleUnit).integerValue(BigNumber.ROUND_HALF_UP).toNumber();

  for (let attempt = 0; attempt < 16 && actualSteps > Y_AXIS_STEP_COUNT; attempt++) {
    scaleUnit = findAllowedScaleUnit(scaleUnit, false);
    maxPoint = roundToMultiple(targetMax, scaleUnit, "ceil");
    minPoint = roundToMultiple(targetMin, scaleUnit, "floor");
    actualSteps = maxPoint.minus(minPoint).dividedBy(scaleUnit).integerValue(BigNumber.ROUND_HALF_UP).toNumber();
  }

  while (
    maxPoint.minus(minPoint).dividedBy(scaleUnit).integerValue(BigNumber.ROUND_HALF_UP).toNumber() < Y_AXIS_STEP_COUNT
  ) {
    const topSlack = maxPoint.minus(targetMax).abs();
    const bottomSlack = targetMin.minus(minPoint).abs();

    if (topSlack.isLessThanOrEqualTo(bottomSlack)) {
      maxPoint = maxPoint.plus(scaleUnit);
    } else {
      const candidateMin = minPoint.minus(scaleUnit);
      if (lowest.isGreaterThanOrEqualTo(0) && candidateMin.isLessThan(0)) {
        maxPoint = maxPoint.plus(scaleUnit);
      } else {
        minPoint = candidateMin;
      }
    }
  }

  const labels: string[] = [];
  for (let index = 0; index <= Y_AXIS_STEP_COUNT; index++) {
    const value = minPoint.plus(scaleUnit.multipliedBy(index));
    labels.push(formatYAxisValue(value, scaleUnit));
  }

  return {
    labels,
    minValue: minPoint.toFixed(),
    maxValue: maxPoint.toFixed(),
  };
}
