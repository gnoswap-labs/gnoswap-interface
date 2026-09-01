import { PACKAGE_COMMON_PATH } from "@constants/environment.constant";

import { TransactionRunMessage } from "./run";

/**
 * Rebuilds the ephemeral package a GRC20 `MsgRun` message is expected to carry.
 *
 * Kept independent from the production template on purpose: `run.spec.ts` pins
 * the generated source verbatim, and every other spec compares against this.
 */
function makeExpectedRunMessage(caller: string, statements: string[]): TransactionRunMessage {
  return {
    caller,
    send: "",
    package: {
      name: "main",
      path: "",
      files: [
        {
          name: "main.gno",
          body: [
            "package main",
            "",
            "import (",
            `\tcommon "${PACKAGE_COMMON_PATH}"`,
            ")",
            "",
            "func main(cur realm) {",
            ...statements.flatMap(statement => [`\tif err := ${statement}; err != nil {`, "\t\tpanic(err)", "\t}"]),
            "}",
            "",
          ].join("\n"),
        },
      ],
    },
  };
}

export function makeExpectedApproveRunMessage({
  caller,
  approves,
}: {
  caller: string;
  approves: { tokenPath: string; spenderAddress: string; amount: string }[];
}): TransactionRunMessage {
  return makeExpectedRunMessage(
    caller,
    approves.map(
      approve =>
        `common.Approve(cross(cur), "${approve.tokenPath}", address("${approve.spenderAddress}"), ${approve.amount})`,
    ),
  );
}

export function makeExpectedTransferRunMessage({
  caller,
  tokenPath,
  toAddress,
  amount,
}: {
  caller: string;
  tokenPath: string;
  toAddress: string;
  amount: string;
}): TransactionRunMessage {
  return makeExpectedRunMessage(caller, [
    `common.Transfer(cross(cur), "${tokenPath}", address("${toAddress}"), ${amount})`,
  ]);
}

/**
 * Reads the single gno source file out of a `MsgRun` message.
 */
export function getRunMessageBody(message: unknown): string {
  const runMessage = message as TransactionRunMessage;
  return runMessage?.package?.files?.[0]?.body ?? "";
}
