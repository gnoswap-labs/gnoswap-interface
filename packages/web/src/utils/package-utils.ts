import { bech32 } from "bech32";
import crypto from "crypto";

function toBech32AddressByPackagePath(
  prefix: string,
  packagePath: string,
): string {
  const bytes = Buffer.from("pkgPath:" + packagePath, "utf-8");
  const hash = crypto
    .createHash("sha256")
    .setEncoding("utf-8")
    .update(bytes)
    .digest();
  return bech32.encode(prefix, bech32.toWords(hash.slice(0, 20)));
}

export function getAddressByPackagePath(packagePath: string) {
  return toBech32AddressByPackagePath("g", packagePath);
}