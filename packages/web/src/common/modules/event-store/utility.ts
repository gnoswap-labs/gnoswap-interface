/**
 * Normalizes wallet hex and RPC base64 transaction hashes for the RPC tx endpoint.
 */
export function makeRpcTransactionHash(hash: string): string {
  if (/^(0x)?[0-9a-f]{64}$/i.test(hash)) {
    return "0x" + hash.slice(-64).toLowerCase();
  }

  return "0x" + Buffer.from(hash, "base64").toString("hex");
}

export function parseABCIValue(str: string): string[] {
  try {
    const decodedData = window.atob(str);

    if (!decodedData) {
      console.warn("Decoded data is empty or null.");
      return [];
    }

    const pattern = /\((\d+|"-?\d+") \w+\)/g;
    const results: string[] = [];
    let match;

    while ((match = pattern.exec(decodedData)) !== null) {
      let value = match[1];

      value = value.replace(/"/g, "");

      results.push(value);
    }

    return results;
  } catch (error) {
    if (error instanceof DOMException && error.name === "InvalidCharacterError") {
      console.error("Invalid Base64 string:", str);
    } else {
      console.error("Failed to parse ABCI value:", error);
    }
  }
  return [];
}
