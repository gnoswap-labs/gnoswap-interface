import BigNumber from "bignumber.js";

export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || "preview";

const isPreview = ENVIRONMENT === "preview";

const PREVIEW_ENV_VARIABLES = {
  DEFAULT_CHAIN_ID: "dev.gnoswap",
  API_URL: "https://dev.api.gnoswap.io/v1",
  PACKAGE_ROUTER_PATH: "gno.land/r/demo/router",
  PACKAGE_POOL_PATH: "gno.land/r/demo/pool",
  PACKAGE_POSITION_PATH: "gno.land/r/demo/position",
  PACKAGE_STAKER_PATH: "gno.land/r/demo/staker",
  PACKAGE_NFT_PATH: "gno.land/r/demo/gnft",
  GOVERNANCE_PATH: "gno.land/r/demo/gov",
  PACKAGE_ROUTER_ADDRESS: "g1pjtpgjpsn4hjfv2n4mpz8cczdn32jkpsqwxuav",
  PACKAGE_POOL_ADDRESS: "g15z32w7txv6lw259xzhzzmwtwmcjjc0m6dqzh6f",
  PACKAGE_POSITION_ADDRESS: "g10wwa53xgu4397kvzz7akxar9370zjdpwux5th9",
  PACKAGE_STAKER_ADDRESS: "g1puv9dz470prjshjm9qyg25dyfvrgph2kvjph68",
  PACKAGE_GOVERNANCE_ADDRESS: "g1kmat25auuqf0h5qvd4q7s707r8let5sky4tr76",
  WRAPPED_GNOT_PATH: "gno.land/r/demo/wugnot",
  GNS_TOKEN_PATH: "gno.land/r/demo/gns",
  CREATE_POOL_FEE: "100000000",
};

const ENV_VARIABLES = {
  DEFAULT_CHAIN_ID: process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || "",
  API_URL: process.env.NEXT_PUBLIC_API_URL || "",
  PACKAGE_ROUTER_PATH: process.env.NEXT_PUBLIC_PACKAGE_ROUTER_PATH || "",
  PACKAGE_POOL_PATH: process.env.NEXT_PUBLIC_PACKAGE_POOL_PATH || "",
  PACKAGE_POSITION_PATH: process.env.NEXT_PUBLIC_PACKAGE_POSITION_PATH || "",
  PACKAGE_STAKER_PATH: process.env.NEXT_PUBLIC_PACKAGE_STAKER_PATH || "",
  PACKAGE_NFT_PATH: process.env.NEXT_PUBLIC_PACKAGE_NFT_PATH || "",
  GOVERNANCE_PATH: process.env.NEXT_PUBLIC_GOVERNANCE_PATH || "",
  WRAPPED_GNOT_PATH: process.env.NEXT_PUBLIC_WRAPPED_GNOT_PATH || "",
  PACKAGE_ROUTER_ADDRESS: process.env.NEXT_PUBLIC_PACKAGE_ROUTER_ADDRESS || "",
  PACKAGE_POOL_ADDRESS: process.env.NEXT_PUBLIC_PACKAGE_POOL_ADDRESS || "",
  PACKAGE_POSITION_ADDRESS:
    process.env.NEXT_PUBLIC_PACKAGE_POSITION_ADDRESS || "",
  PACKAGE_STAKER_ADDRESS: process.env.NEXT_PUBLIC_PACKAGE_STAKER_ADDRESS || "",
  PACKAGE_GOVERNANCE_ADDRESS:
    process.env.NEXT_PUBLIC_PACKAGE_GOVERNANCE_ADDRESS || "",
  GNS_TOKEN_PATH: process.env.NEXT_PUBLIC_GNS_TOKEN_PATH || "",
  CREATE_POOL_FEE: process.env.NEXT_PUBLIC_PACKAGE_CREATE_POOL_FEE || "",
};

const currentEnvVariables = isPreview ? PREVIEW_ENV_VARIABLES : ENV_VARIABLES;

export const DEFAULT_CHAIN_ID = currentEnvVariables.DEFAULT_CHAIN_ID;
export const API_URL = currentEnvVariables.API_URL;
export const PACKAGE_ROUTER_PATH = currentEnvVariables.PACKAGE_ROUTER_PATH;
export const PACKAGE_POOL_PATH = currentEnvVariables.PACKAGE_POOL_PATH;
export const PACKAGE_POSITION_PATH = currentEnvVariables.PACKAGE_POSITION_PATH;
export const PACKAGE_STAKER_PATH = currentEnvVariables.PACKAGE_STAKER_PATH;
export const PACKAGE_NFT_PATH = currentEnvVariables.PACKAGE_NFT_PATH;
export const GOVERNANCE_PATH = currentEnvVariables.GOVERNANCE_PATH;
export const WRAPPED_GNOT_PATH = currentEnvVariables.WRAPPED_GNOT_PATH;
export const PACKAGE_ROUTER_ADDRESS =
  currentEnvVariables.PACKAGE_ROUTER_ADDRESS;
export const PACKAGE_POOL_ADDRESS = currentEnvVariables.PACKAGE_POOL_ADDRESS;
export const PACKAGE_POSITION_ADDRESS =
  currentEnvVariables.PACKAGE_POSITION_ADDRESS;
export const PACKAGE_STAKER_ADDRESS =
  currentEnvVariables.PACKAGE_STAKER_ADDRESS;
export const PACKAGE_GOVERNANCE_ADDRESS =
  currentEnvVariables.PACKAGE_GOVERNANCE_ADDRESS;
export const GNS_TOKEN_PATH = currentEnvVariables.GNS_TOKEN_PATH;
export const CREATE_POOL_FEE = currentEnvVariables.CREATE_POOL_FEE;

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

export function makeBankSendGNOTMessage({
  from,
  to,
  sendAmount,
}: {
  from: string;
  to: string;
  sendAmount: string;
}): TransactionBankMessage {
  const amount = `${sendAmount}ugnot`;

  return {
    from_address: from,
    to_address: to,
    amount,
  };
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
    args: args ? args.map(arg => `${arg}`) : null,
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

export function makeGNOTSendAmount(amount: string | number | null): string {
  if (!amount || BigNumber(amount).isZero()) {
    return "";
  }
  return BigNumber(amount).toString() + "ugnot";
}
