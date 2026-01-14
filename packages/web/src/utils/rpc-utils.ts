import BigNumber from "bignumber.js";

export function makeABCIParams(functionName: string, args: (string | number | boolean)[]) {
  const argsStr = args.map(arg => (typeof arg === "string" ? `"${arg}"` : `${arg}`)).join(", ");
  return `${functionName}(${argsStr})`;
}

export function evaluateExpressionToNumber(evaluateExpression: string) {
  try {
    const result = matchNumberValues(evaluateExpression);
    const parsedValue = result.length > 0 ? result[0] : 0;
    return BigNumber(parsedValue).toNumber();
  } catch {
    console.error("Parse Error: " + evaluateExpression);
    return 0;
  }
}

export function evaluateExpressionToObject<T extends object>(evaluateExpression: string): T | null {
  try {
    const result = matchStringValues(evaluateExpression);
    if (result.length === 0) {
      return null;
    }

    const objectStr = parseABCIValue(result[0]);
    const object = JSON.parse(JSON.parse(objectStr), (_, value) => value as T);
    return object;
  } catch {
    return null;
  }
}

export function evaluateExpressionToStrings(evaluateExpression: string): string[] {
  try {
    const result = matchStringValues(evaluateExpression);
    return result.map(value => parseABCIValue(value)).map(value => value.replace(/^"(.*)"$/, "$1"));
  } catch {
    return [];
  }
}

export function evaluateExpressionToUint256(evaluateExpression: string): bigint {
  try {
    const matches = evaluateExpression.match(/\((\d+)\s+uint64\)/g);

    if (!matches || matches.length === 0) {
      console.error("Failed to parse uint64 array from response:", evaluateExpression);
      return 0n;
    }

    const uint64Array = matches.map(match => {
      const numMatch = match.match(/\((\d+)\s+uint64\)/);
      return numMatch ? numMatch[1] : "0";
    });

    // result = uint64[0] + (uint64[1] << 64) + (uint64[2] << 128) + (uint64[3] << 192)
    const result = uint64Array.reduce((acc, val, idx) => {
      return acc + (BigInt(val) << BigInt(64 * idx));
    }, 0n);

    return result;
  } catch (error) {
    console.error("Parse Error (uint256):", evaluateExpression, error);
    return 0n;
  }
}

function matchNumberValues(str: string): string[] {
  const regex = /\((?:"([^"]+)"|(\d+))\s+\w+\)/g;
  const results: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(str)) !== null) {
    if (match[1] !== undefined) {
      results.push(match[1]);
    } else if (match[2] !== undefined) {
      results.push(match[2]);
    }
  }

  return results;
}

function matchStringValues(str: string): string[] {
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
