import { makeApproveMessage, PACKAGE_POOL_ADDRESS } from "./common";

export function makePoolTokenApproveMessage(
  packagePath: string,
  amount: string,
  caller: string,
) {
  return makeApproveMessage(
    packagePath,
    [PACKAGE_POOL_ADDRESS, amount],
    caller,
  );
}
