import Grc20MethodSpecsJson from "@resources/grc20-method-specs.json";

/**
 * Describes a token whose balance mutations are sent straight to its realm.
 *
 * Tokens listed in `resources/grc20-method-specs.json` expose crossing
 * `Approve`/`Transfer` functions, so a plain `MsgCall` can reach them without
 * routing through the GRC20 registry via `MsgRun`.
 */
export interface Grc20MethodSpec {
  /** GRC20 registry key of the token (`<pkgPath>.<slug>`). */
  tokenKey: string;
  /** Realm path that receives the `MsgCall`. */
  packagePath: string;
  transferMethod: string;
  approveMethod: string;
}

const GRC20_METHOD_SPECS: readonly Grc20MethodSpec[] = Grc20MethodSpecsJson;

const GRC20_METHOD_SPEC_MAP: ReadonlyMap<string, Grc20MethodSpec> = new Map(
  GRC20_METHOD_SPECS.map(config => [config.tokenKey, config]),
);

/** Returns the direct-call method spec of a token key, or `null` when it is not registered. */
export function getGrc20MethodSpec(tokenKey: string): Grc20MethodSpec | null {
  return GRC20_METHOD_SPEC_MAP.get(tokenKey) ?? null;
}
