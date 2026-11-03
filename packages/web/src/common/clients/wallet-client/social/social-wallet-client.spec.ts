/** @jest-environment node */
import { MsgCall, MsgRun } from "@gnolang/gno-js-client";

import { Document } from "src/types/transaction-messages.types";

import { documentToSDKTx } from "./social-wallet-client";

/** Shaped like a document from transformMessages: no max_deposit, and args may be null. */
const document: Document = {
  chain_id: "dev.gnoswap",
  account_number: "1",
  sequence: "2",
  fee: { amount: [{ denom: "ugnot", amount: "1" }], gas: "5000000" },
  msgs: [
    {
      type: "/vm.m_call",
      value: {
        caller: "g1caller",
        send: "",
        pkg_path: "gno.land/r/demo/foo",
        func: "Bar",
        args: null,
      } as unknown as MsgCall,
    },
    {
      type: "/vm.m_run",
      value: {
        caller: "g1caller",
        send: "",
        package: { name: "main", path: "", files: [{ name: "main.gno", body: "package main" }] },
      } as unknown as MsgRun,
    },
  ],
  memo: "",
};

describe("documentToSDKTx", () => {
  it("encodes messages built by the transaction guard", () => {
    expect(() => documentToSDKTx(document)).not.toThrow();
    expect(documentToSDKTx(document).messages).toHaveLength(2);
  });
});
