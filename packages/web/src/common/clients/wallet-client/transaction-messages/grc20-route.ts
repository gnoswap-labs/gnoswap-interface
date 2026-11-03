import { TransactionMessageError } from "@common/errors";
import { Grc20RoutePlaceholder, Grc20Routes } from "@models/token/token-model";

export type Grc20RouteOperation = "approve" | "transfer";

interface Grc20RouteToken {
  path: string;
  pkgPath?: string;
  routes?: Grc20Routes;
}

type Grc20RouteValues = Partial<Record<Grc20RoutePlaceholder, string>>;

export interface ResolvedGrc20Route {
  packagePath: string;
  func: string;
  args: string[];
}

function substituteRouteArgs(args: string[], values: Grc20RouteValues): string[] {
  return args.map(arg => {
    if (arg.startsWith("$$")) {
      return arg.slice(1);
    }

    if (!arg.startsWith("$")) {
      return arg;
    }

    const value = values[arg as Grc20RoutePlaceholder];
    if (value === undefined) {
      throw new TransactionMessageError("FAILED_BUILD_GRC20_ROUTE", arg);
    }

    return value;
  });
}

/**
 * Resolves resource route metadata.
 * `null` means no routes metadata exists and the caller should use MsgRun.
 */
export function resolveGrc20Route(
  token: Grc20RouteToken,
  operation: Grc20RouteOperation,
  values: Grc20RouteValues,
): ResolvedGrc20Route | null {
  if (token.routes) {
    const route = token.routes.funcs[operation];
    if (!route || !token.pkgPath) {
      throw new TransactionMessageError("FAILED_BUILD_GRC20_ROUTE", { tokenPath: token.path, operation });
    }

    return {
      packagePath: token.pkgPath,
      func: route.name,
      args: substituteRouteArgs(route.args, values),
    };
  }

  return null;
}
