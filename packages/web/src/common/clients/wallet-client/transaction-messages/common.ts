export const PACKAGE_ROUTER_PATH =
  process.env.NEXT_PUBLIC_PACKAGE_ROUTER_PATH || "";
export const PACKAGE_POOL_PATH =
  process.env.NEXT_PUBLIC_PACKAGE_POOL_PATH || "";
export const PACKAGE_POSITION_PATH =
  process.env.NEXT_PUBLIC_PACKAGE_POSITION_PATH || "";
export const PACKAGE_STAKER_PATH =
  process.env.NEXT_PUBLIC_PACKAGE_STAKER_PATH || "";
export const PACKAGE_NFT_PATH = process.env.NEXT_PUBLIC_PACKAGE_NFT_PATH || "";
export const GOVERNANCE_PATH = process.env.NEXT_PUBLIC_GOVERNANCE_PATH || "";
export const WRAPPED_GNOT_PATH =
  process.env.NEXT_PUBLIC_WRAPPED_GNOT_PATH || "";
export const PACKAGE_ROUTER_ADDRESS =
  process.env.NEXT_PUBLIC_PACKAGE_ROUTER_ADDRESS || "";
export const PACKAGE_POOL_ADDRESS =
  process.env.NEXT_PUBLIC_PACKAGE_POOL_ADDRESS || "";
export const PACKAGE_POSITION_ADDRESS =
  process.env.NEXT_PUBLIC_PACKAGE_POSITION_ADDRESS || "";
export const PACKAGE_STAKER_ADDRESS =
  process.env.NEXT_PUBLIC_PACKAGE_STAKER_ADDRESS || "";
export const PACKAGE_GOVERNANCE_ADDRESS =
  process.env.NEXT_PUBLIC_PACKAGE_GOVERNANCE_ADDRESS || "";
export const PACKAGE_FAUCET_PATH =
  process.env.NEXT_PUBLIC_PACKAGE_FAUCET_PATH || "";

export interface TransactionBankMessage {
  from_address: string;
  to_address: string;
  amount: string;
}

export interface TransactionMessage {
  caller: string;
  send: string;
  pkg_path: string;
  func: string;
  args: string[] | null;
}

export function makeTransactionMessage({
  caller,
  send,
  packagePath,
  func,
  args,
}: {
  caller: string;
  send: string;
  packagePath: string;
  func: string;
  args: string[] | null;
}): TransactionMessage {
  return {
    caller: caller,
    send: send,
    pkg_path: packagePath,
    func: func,
    args: args,
  };
}

export function makeApproveMessage(
  packagePath: string,
  args: string[],
  caller: string,
) {
  return makeTransactionMessage({
    caller,
    send: "",
    packagePath,
    func: "Approve",
    args,
  });
}
