import TokenMessagesJson from "@resources/token-messages.json";

/**
 * Describes a token whose balance mutations are sent straight to its realm.
 *
 * Tokens listed in `resources/token-messages.json` expose crossing
 * `Approve`/`Transfer` functions, so a plain `MsgCall` can reach them without
 * routing through the GRC20 registry via `MsgRun`.
 */
export interface TokenMessageConfig {
  /** GRC20 registry key of the token (`<pkgPath>.<slug>`). */
  tokenKey: string;
  /** Realm path that receives the `MsgCall`. */
  packagePath: string;
  transferMethod: string;
  approveMethod: string;
}

const TOKEN_MESSAGE_CONFIGS: readonly TokenMessageConfig[] = TokenMessagesJson;

const TOKEN_MESSAGE_CONFIG_MAP: ReadonlyMap<string, TokenMessageConfig> = new Map(
  TOKEN_MESSAGE_CONFIGS.map(config => [config.tokenKey, config]),
);

/** Returns the direct-call config of a token key, or `null` when it is not registered. */
export function getTokenMessageConfig(tokenKey: string): TokenMessageConfig | null {
  return TOKEN_MESSAGE_CONFIG_MAP.get(tokenKey) ?? null;
}
