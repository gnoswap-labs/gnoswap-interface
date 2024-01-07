import BigNumber from "bignumber.js";
import { V3Route } from "../../router";

export function makeABCIParams(
  functionName: string,
  args: (string | number | boolean)[],
) {
  const argsStr = args
    .map(arg => (typeof arg === "string" ? `"${arg}"` : `${arg}`))
    .join(", ");
  return `${functionName}(${argsStr})`;
}

export function evaluateExpressionToNumber(evaluateExpression: string) {
  try {
    const result = matchValues(evaluateExpression);

    const parsedValue = parseABCIValue(result[0]);
    return BigNumber(parsedValue).toNumber();
  } catch {
    console.error("Parse Error: " + evaluateExpression);
    return 0;
  }
}

export function evaluateExpressionToObject<T extends {}>(
  evaluateExpression: string,
): T | null {
  try {
    const result = matchValues(evaluateExpression);
    if (result.length === 0) {
      return null;
    }

    const objectStr = parseABCIValue(result[0]);
    const object = JSON.parse(JSON.parse(objectStr), (_, value) => value as T);
    return object;
  } catch {
    console.error("Parse Error: " + evaluateExpression);
    return null;
  }
}

export function evaluateExpressionToValues(
  evaluateExpression: string,
): string[] {
  try {
    const result = matchValues(evaluateExpression);

    const values: string[] = [];
    for (const data of result) {
      const value = parseABCIValue(data);
      values.push(value);
    }

    return values;
  } catch {
    console.error("Parse Error: " + evaluateExpression);
    return [];
  }
}

function matchValues(str: string): string[] {
  const regexp = /\((.*)\)/g;
  const result = str.match(regexp);
  if (result === null || result.length < 1) {
    return [];
  }
  return result;
}

function parseABCIValue(str: string): string {
  const regexp = /\s.*$/;
  return str.replace(regexp, "").slice(1);
}

export function makeRoutesQuery(routes: V3Route[], fromPath: string) {
  const POOL_DIVIDER = "*POOL*";
  return routes
    .map(route => {
      let currentFromPath = fromPath;
      return route.pools
        .map(pool => {
          const { token0, token1, fee } = pool;
          const ordered = currentFromPath === token0.address;
          const inputTokenPath = ordered ? token0.address : token1.address;
          const outputTokenPath = ordered ? token1.address : token0.address;
          currentFromPath = outputTokenPath;
          return `${inputTokenPath}:${outputTokenPath}:${fee.toString()}`;
        })
        .join(POOL_DIVIDER);
    })
    .join(",");
}
