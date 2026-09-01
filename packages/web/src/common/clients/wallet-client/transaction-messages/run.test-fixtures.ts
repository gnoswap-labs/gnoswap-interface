import { PACKAGE_GRC20_REGISTRY_PATH } from "@constants/environment.constant";

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
            `\tgrc20reg "${PACKAGE_GRC20_REGISTRY_PATH}"`,
            ")",
            "",
            "func main(cur realm) {",
            ...statements.map(statement => `\t${statement}`),
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
        `grc20reg.Approve(0, cur, "${approve.tokenPath}", address("${approve.spenderAddress}"), ${approve.amount})`,
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
    `grc20reg.Transfer(0, cur, "${tokenPath}", address("${toAddress}"), ${amount})`,
  ]);
}

/**
 * Reads the single gno source file out of a `MsgRun` message.
 */
export function getRunMessageBody(message: unknown): string {
  const runMessage = message as TransactionRunMessage;
  return runMessage?.package?.files?.[0]?.body ?? "";
}
