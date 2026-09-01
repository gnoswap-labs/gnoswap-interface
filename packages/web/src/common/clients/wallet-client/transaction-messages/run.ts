import BigNumber from "bignumber.js";

import { TransactionMessageOfRun } from "@common/clients/wallet-client/protocols";
import { TransactionMessageError } from "@common/errors";
import { PACKAGE_COMMON_PATH } from "@constants/environment.constant";

/**
 * GRC20 balance mutations are expressed as `MsgRun` instead of `MsgCall`.
 *
 * The gnoswap `common` realm exposes GRC20 helpers as crossing functions
 * (`Approve(cur realm, ...)`, `Transfer(cur realm, ...)`) that derive the token
 * actor from `cur.Previous()`. Running an ephemeral `main` package keeps that
 * actor bound to the signer: the node executes `MsgRun` in the reserved
 * `gno.land/e/<caller>/run` realm, whose address is the caller address itself.
 *
 * @see {@link https://github.com/onbloc/adena-wallet/blob/3e91e597a966ee0ab14bd45a9bcd67a2717186c2/packages/adena-extension/src/pages/popup/wallet/transfer-summary/index.tsx#L328-L387}
 */
export type TransactionRunMessage = TransactionMessageOfRun;

/** The node only accepts "main" as the package name of an ephemeral run package. */
const RUN_PACKAGE_NAME = "main";
/** Left empty so the node assigns the reserved `gno.land/e/<caller>/run` path. */
const RUN_PACKAGE_PATH = "";
const RUN_FILE_NAME = "main.gno";
/** Import alias, so the generated source does not depend on the realm path shape. */
const COMMON_REALM_ALIAS = "common";

/** Written as an escape sequence so this file keeps double-quoted strings. */
const DOUBLE_QUOTE = "\u0022";

const GNO_ESCAPE_SEQUENCES: Record<string, string> = {
  "\\": "\\\\",
  [DOUBLE_QUOTE]: `\\${DOUBLE_QUOTE}`,
  "\n": "\\n",
  "\r": "\\r",
  "\t": "\\t",
};

/**
 * Renders a value as a gno (Go) interpreted string literal.
 *
 * Every character that could terminate or escape the literal is encoded, so no
 * caller-supplied value can inject statements into the generated source.
 */
export function gnoStringLiteral(value: string): string {
  let escaped = "";

  for (const char of value) {
    const codePoint = char.codePointAt(0) ?? 0;
    const escapeSequence = GNO_ESCAPE_SEQUENCES[char];

    if (escapeSequence) {
      escaped += escapeSequence;
    } else if (codePoint < 0x20 || codePoint === 0x7f) {
      escaped += `\\u${codePoint.toString(16).padStart(4, "0")}`;
    } else {
      escaped += char;
    }
  }

  return `"${escaped}"`;
}

/**
 * Renders an amount as a gno `int64` literal.
 *
 * Amounts are inlined without quotes, so anything that is not a non-negative
 * integer is rejected instead of being written into the source.
 */
export function gnoInt64Literal(amount: string | number | bigint): string {
  const amountBN = BigNumber(amount.toString());

  if (!amountBN.isFinite() || !amountBN.isInteger() || amountBN.isNegative()) {
    throw new TransactionMessageError("FAILED_BUILD_RUN_MESSAGE", amount);
  }

  return amountBN.toFixed(0);
}

/**
 * Wraps one or more `common` realm calls in a single ephemeral package, so a
 * run of statements (consecutive approves, for instance) costs one message.
 */
function makeCommonRealmRunMessage(caller: string, statements: string[]): TransactionRunMessage {
  if (statements.length === 0) {
    throw new TransactionMessageError("FAILED_BUILD_RUN_MESSAGE", statements);
  }

  const body = [
    "package main",
    "",
    "import (",
    `\t${COMMON_REALM_ALIAS} ${gnoStringLiteral(PACKAGE_COMMON_PATH)}`,
    ")",
    "",
    "func main(cur realm) {",
    ...statements.flatMap(statement => [`\tif err := ${statement}; err != nil {`, "\t\tpanic(err)", "\t}"]),
    "}",
    "",
  ].join("\n");

  return {
    caller,
    send: "",
    package: {
      name: RUN_PACKAGE_NAME,
      path: RUN_PACKAGE_PATH,
      files: [{ name: RUN_FILE_NAME, body }],
    },
  };
}

export interface GRC20ApproveRunMessageInfo {
  tokenPath: string;
  spenderAddress: string;
  amount: string | bigint | number;
}

/**
 * Builds one `MsgRun` message that runs every given `common.Approve` call.
 *
 * Approves always travel as a consecutive block, so batching them into a
 * single ephemeral package keeps the wallet to one message instead of one per
 * token/spender pair.
 */
export function makeGRC20ApproveRunMessage({
  approves,
  caller,
}: {
  approves: GRC20ApproveRunMessageInfo[];
  caller: string;
}): TransactionRunMessage {
  const statements = approves.map(
    approve =>
      `${COMMON_REALM_ALIAS}.Approve(cross(cur), ${gnoStringLiteral(approve.tokenPath)}, address(${gnoStringLiteral(
        approve.spenderAddress,
      )}), ${gnoInt64Literal(approve.amount)})`,
  );

  return makeCommonRealmRunMessage(caller, statements);
}

/**
 * Builds the `MsgRun` equivalent of `common.Transfer(tokenKey, to, amount)`.
 */
export function makeGRC20TransferRunMessage({
  tokenPath,
  toAddress,
  amount,
  caller,
}: {
  tokenPath: string;
  toAddress: string;
  amount: string | bigint | number;
  caller: string;
}): TransactionRunMessage {
  const statement = `${COMMON_REALM_ALIAS}.Transfer(cross(cur), ${gnoStringLiteral(
    tokenPath,
  )}, address(${gnoStringLiteral(toAddress)}), ${gnoInt64Literal(amount)})`;

  return makeCommonRealmRunMessage(caller, [statement]);
}
