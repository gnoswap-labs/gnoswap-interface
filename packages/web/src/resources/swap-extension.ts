import { TokenModel } from "@models/token/token-model";
import { getAddressByPackagePath } from "@utils/package-utils";

import rawSwapExtensions from "./swap-extension.json";

export type SwapExtensionRouteInput =
  | "$address"
  | "$amount"
  | "$from"
  | "$spender"
  | "$to"
  | "$wrappedTokenAddress";

type SwapExtensionPackagePath = "$originTokenPath" | "$grc20WrappedPackagePath";

export interface SwapExtensionRoute {
  function: string;
  inputs: SwapExtensionRouteInput[];
}

export interface SwapExtensionExecution {
  function: string;
  packagePath: SwapExtensionPackagePath | string;
  inputs: SwapExtensionRouteInput[];
}

export interface SwapExtension {
  grc20WrappedTokenPath: string;
  grc20WrappedPackagePath: string;
  wrappedTokenInfo: {
    displaySymbol: string;
  };
  originTokenPath: string;
  originTokenInfo: {
    name: string;
    symbol: string;
    decimals: number;
    logoUrl: string;
  };
  originRoutes: {
    balance: SwapExtensionRoute;
    approve: SwapExtensionRoute;
    transfer: SwapExtensionRoute;
    transferFrom: SwapExtensionRoute;
  };
  executions: {
    wrap: SwapExtensionExecution[];
    unwrap: SwapExtensionExecution[];
  };
}

const packagePathPlaceholders = new Set<SwapExtensionPackagePath>([
  "$originTokenPath",
  "$grc20WrappedPackagePath",
]);

// This bundled file is reviewed and exercised as source code. Keep this assertion at
// the import boundary so every consumer uses the named contract.
export const swapExtensions = rawSwapExtensions as unknown as SwapExtension[];

export function getSwapExtensionByOriginPath(path?: string | null) {
  return swapExtensions.find(extension => extension.originTokenPath === path) ?? null;
}

export function getSwapExtensionByWrappedPath(path?: string | null) {
  return swapExtensions.find(extension => extension.grc20WrappedTokenPath === path) ?? null;
}

export function getSwapExtensionForTokenSelector(currentPath?: string | null, oppositePath?: string | null) {
  const oppositeExtension = getSwapExtensionByWrappedPath(oppositePath);
  if (oppositeExtension) return oppositeExtension;

  const currentExtension = getSwapExtensionByWrappedPath(currentPath);
  return currentExtension?.originTokenPath === oppositePath ? currentExtension : null;
}

export function getSwapExtension(path?: string | null) {
  return getSwapExtensionByOriginPath(path) ?? getSwapExtensionByWrappedPath(path);
}


export function createOriginToken(extension: SwapExtension, wrappedToken: TokenModel): TokenModel {
  const { originTokenInfo } = extension;
  return {
    type: "Native",
    chainId: wrappedToken.chainId,
    createdAt: wrappedToken.createdAt,
    name: originTokenInfo.name,
    path: extension.originTokenPath,
    wrappedPath: extension.grc20WrappedTokenPath,
    decimals: originTokenInfo.decimals,
    symbol: originTokenInfo.symbol,
    displaySymbol: originTokenInfo.symbol,
    logoURI: originTokenInfo.logoUrl || wrappedToken.logoURI,
    isVerified: wrappedToken.isVerified,
    priceID: extension.grc20WrappedTokenPath,
    address: "",
    pkgPath: extension.originTokenPath,
    routes: {
      funcs: {
        approve: {
          name: extension.originRoutes.approve.function,
          args: extension.originRoutes.approve.inputs,
        },
        transfer: {
          name: extension.originRoutes.transfer.function,
          args: extension.originRoutes.transfer.inputs,
        },
        transfer_from: {
          name: extension.originRoutes.transferFrom.function,
          args: extension.originRoutes.transferFrom.inputs,
        },
      },
    },
  };
}

export function getOriginToken(extension: SwapExtension, tokens: TokenModel[]) {
  const wrappedToken = tokens.find(token => token.path === extension.grc20WrappedTokenPath);
  return wrappedToken ? createOriginToken(extension, wrappedToken) : null;
}

export function isSwapExtensionPair(tokenA?: TokenModel | null, tokenB?: TokenModel | null) {
  if (!tokenA || !tokenB) return false;
  const extension = getSwapExtensionByOriginPath(tokenA.path) ?? getSwapExtensionByOriginPath(tokenB.path);
  if (!extension) return false;
  return (
    (tokenA.path === extension.originTokenPath && tokenB.path === extension.grc20WrappedTokenPath) ||
    (tokenB.path === extension.originTokenPath && tokenA.path === extension.grc20WrappedTokenPath)
  );
}


interface ExecutionValues {
  amount: string;
  address?: string;
  from?: string;
  spender?: string;
  to?: string;
}

export function resolveSwapExtensionExecution(
  extension: SwapExtension,
  operation: keyof SwapExtension["executions"],
  values: ExecutionValues,
) {
  const inputValues: Record<SwapExtensionRouteInput, string | undefined> = {
    $address: values.address,
    $amount: values.amount,
    $from: values.from,
    $spender: values.spender,
    $to: values.to,
    $wrappedTokenAddress: getAddressByPackagePath(extension.grc20WrappedPackagePath),
  };
  const packagePaths: Record<SwapExtensionPackagePath, string> = {
    $originTokenPath: extension.originTokenPath,
    $grc20WrappedPackagePath: extension.grc20WrappedPackagePath,
  };

  return extension.executions[operation].map(step => ({
    function: step.function,
    packagePath: packagePathPlaceholders.has(step.packagePath as SwapExtensionPackagePath)
      ? packagePaths[step.packagePath as SwapExtensionPackagePath]
      : step.packagePath,
    inputs: step.inputs.map(input => {
      const resolved = inputValues[input];
      if (resolved === undefined) throw new Error(`Missing swap extension input: ${input}`);
      return resolved;
    }),
  }));
}
