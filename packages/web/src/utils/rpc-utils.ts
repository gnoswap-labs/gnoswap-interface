import BigNumber from "bignumber.js";

export function makeABCIParams(functionName: string, args: (string | number | boolean)[]) {
  const argsStr = args.map(arg => (typeof arg === "string" ? `"${arg}"` : `${arg}`)).join(", ");
  return `${functionName}(${argsStr})`;
}

export function evaluateExpressionToNumber(evaluateExpression: string) {
  try {
    const result = matchNumberValues(evaluateExpression);
    const parsedValue = parseABCIValue(result[0]);
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
