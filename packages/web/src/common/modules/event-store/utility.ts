/**
 * Converts a base64-encoded hash to hex.
 * Use when calling the tx endpoint of an RPC.
 */
export function makeHexByBase64(base64Hash: string) {
  const buffer = Buffer.from(base64Hash, "base64");
  return "0x" + buffer.toString("hex");
}

function matchValues(str: string): string[] {
  const results: string[] = [];

  const pattern = /\b(\d+)\b (\w+)|\("([^"]*)"\) (\w+)/g;

  let match;
  while ((match = pattern.exec(str)) !== null) {
    if (match[1]) {
      results.push(match[1]);
    } else if (match[3]) {
      results.push(match[3]);
    }
  }

  return results;
}

export function parseABCIValue(str: string): string[] {
  try {
    const decodedData = window.atob(str);

    if (!decodedData) {
      console.warn("Decoded data is empty or null.");
      return [];
    }

    const result = matchValues(decodedData);

    if (Array.isArray(result) && result.length > 0) {
      return result.map(value => {
        let cleanedValue = value.trim();
        cleanedValue = cleanedValue.slice(1);
        cleanedValue = cleanedValue.replace(/"/g, "");
        return cleanedValue;
      });
    } else {
      console.warn("No valid values found in the decoded data.");
    }
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "InvalidCharacterError"
    ) {
      console.error("Invalid Base64 string:", str);
    } else {
      console.error("Failed to parse ABCI value:", error);
    }
  }
  return [];
}
