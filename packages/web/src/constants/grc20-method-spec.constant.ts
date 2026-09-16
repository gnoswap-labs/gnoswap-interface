import Grc20MethodSpecsJson from "@resources/grc20-method-specs.json";

/** Tokens whose `Approve`/`Transfer` are called directly via `MsgCall` instead of `MsgRun`. */
export interface Grc20MethodSpec {
  tokenKey: string;
  packagePath: string;
  transferMethod: string;
  approveMethod: string;
}

const GRC20_METHOD_SPECS: readonly Grc20MethodSpec[] = Grc20MethodSpecsJson;

const GRC20_METHOD_SPEC_MAP: ReadonlyMap<string, Grc20MethodSpec> = new Map(
  GRC20_METHOD_SPECS.map(config => [config.tokenKey, config]),
);

export function getGrc20MethodSpec(tokenKey: string): Grc20MethodSpec | null {
  return GRC20_METHOD_SPEC_MAP.get(tokenKey) ?? null;
}
