/**
 * Converts a base64-encoded hash to hex.
 * Use when calling the tx endpoint of an RPC.
 */
export function makeHexByBase64(base64Hash: string) {
  const buffer = Buffer.from(base64Hash, "base64");
  return "0x" + buffer.toString("hex");
}

function matchValues(str: string): string[] {
  const regexp = /\((.*)\)/g;
  const result = str.match(regexp);
  if (result === null || result.length < 1) {
    return [];
  }
  return result;
}

export function parseABCIValue(str: string): string[] {
  const regexp = /\s.*$/;
  try {
    const decodedData = window.atob(str);
    const result = matchValues(decodedData);
    if (result.length > 0) {
      return result.map(value =>
        // eslint-disable-next-line quotes
        value.replace(regexp, "").slice(1).replaceAll('"', ""),
      );
    }
  } catch {}
  return [];
}
