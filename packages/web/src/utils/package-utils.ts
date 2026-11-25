import { sha256 } from "@noble/hashes/sha256";
import { bech32 } from "bech32";

function toBech32AddressByPackagePath(prefix: string, packagePath: string): string {
  const hash = sha256("pkgPath:" + packagePath);

  return bech32.encode(prefix, bech32.toWords(hash.subarray(0, 20)));
}

export function getAddressByPackagePath(packagePath: string) {
  return toBech32AddressByPackagePath("g", packagePath);
}
