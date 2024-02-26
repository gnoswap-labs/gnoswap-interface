import { ErrorResponse } from "@common/errors/response";
import { bech32 } from "bech32";

function fromBech32(
  address: string,
  limit = Infinity,
): { readonly prefix: string; readonly data: Uint8Array } {
  const decodedAddress = bech32.decode(address, limit);
  return {
    prefix: decodedAddress.prefix,
    data: new Uint8Array(bech32.fromWords(decodedAddress.words)),
  };
}

export function addressValidationCheck(address: string): boolean {
  try {
    const publicKey = fromBech32(address);
    return Boolean(publicKey?.prefix);
  } catch {
    return false;
  }
}

export function isErrorResponse(resposne: any): resposne is ErrorResponse {
  return resposne?.isError === true;
}

export function isEmptyObject(obj: object): boolean {
  return Object.keys(obj).length === 0;
}
