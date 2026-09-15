import { MsgAddPackage, MsgCall, MsgRun, MsgSend } from "@gnolang/gno-js-client";

import { ContractMessage, Document } from "src/types/transaction-messages.types";

import { documentToTx } from "./transaction-utils";

const makeDocument = (msgs: ContractMessage[]): Document => ({
  chain_id: "dev.gnoswap",
  account_number: "1",
  sequence: "2",
  fee: {
    amount: [{ denom: "ugnot", amount: "1000" }],
    gas: "5000000",
  },
  msgs,
  memo: "",
});

/**
 * `documentToTx` rebuilds every message from scratch, so any field it forgets to
 * copy is silently dropped from the signed transaction. These decode the encoded
 * payload back to assert the VM deposit fields survive the round trip.
 */
describe("documentToTx", () => {
  it("preserves send and max_deposit on MsgCall", () => {
    const tx = documentToTx(
      makeDocument([
        {
          type: "/vm.m_call",
          value: {
            caller: "g1caller",
            send: "10ugnot",
            max_deposit: "123ugnot",
            pkg_path: "gno.land/r/demo/foo",
            func: "Bar",
            args: ["1"],
          } as MsgCall,
        },
      ]),
    );

    const decoded = MsgCall.decode(tx.messages[0].value);

    expect(tx.messages[0].type_url).toBe("/vm.m_call");
    expect(decoded.caller).toBe("g1caller");
    expect(decoded.send).toBe("10ugnot");
    expect(decoded.max_deposit).toBe("123ugnot");
    expect(decoded.args).toEqual(["1"]);
  });

  it("preserves send and max_deposit on MsgRun", () => {
    const tx = documentToTx(
      makeDocument([
        {
          type: "/vm.m_run",
          value: {
            caller: "g1caller",
            send: "10ugnot",
            max_deposit: "123ugnot",
            package: { name: "main", path: "", files: [{ name: "main.gno", body: "package main" }] },
          } as MsgRun,
        },
      ]),
    );

    const decoded = MsgRun.decode(tx.messages[0].value);

    expect(tx.messages[0].type_url).toBe("/vm.m_run");
    expect(decoded.send).toBe("10ugnot");
    expect(decoded.max_deposit).toBe("123ugnot");
    expect(decoded.package?.files[0].body).toBe("package main");
  });

  it("preserves send and max_deposit on MsgAddPackage", () => {
    const tx = documentToTx(
      makeDocument([
        {
          type: "/vm.m_addpkg",
          value: {
            creator: "g1creator",
            send: "10ugnot",
            max_deposit: "123ugnot",
            package: { name: "foo", path: "gno.land/r/demo/foo", files: [{ name: "foo.gno", body: "package foo" }] },
          } as MsgAddPackage,
        },
      ]),
    );

    const decoded = MsgAddPackage.decode(tx.messages[0].value);

    expect(tx.messages[0].type_url).toBe("/vm.m_addpkg");
    expect(decoded.creator).toBe("g1creator");
    expect(decoded.send).toBe("10ugnot");
    expect(decoded.max_deposit).toBe("123ugnot");
    expect(decoded.package?.path).toBe("gno.land/r/demo/foo");
  });

  it("encodes MsgSend and the bigint fee", () => {
    const tx = documentToTx(
      makeDocument([
        {
          type: "/bank.MsgSend",
          value: {
            from_address: "g1sender",
            to_address: "g1receiver",
            amount: "1000ugnot",
          } as MsgSend,
        },
      ]),
    );

    const decoded = MsgSend.decode(tx.messages[0].value);

    expect(decoded.from_address).toBe("g1sender");
    expect(decoded.amount).toBe("1000ugnot");
    expect(tx.fee?.gas_wanted).toBe(5000000n);
    expect(tx.fee?.gas_fee).toBe("1000ugnot");
  });
});
