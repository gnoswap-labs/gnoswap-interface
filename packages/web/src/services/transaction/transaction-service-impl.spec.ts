/**
 * Importing the service pulls in @adena-wallet/sdk, whose web3auth dependency
 * hashes at module load and rejects jsdom's cross-realm Uint8Array. None of
 * this suite needs a DOM.
 *
 * @jest-environment node
 */
import { MsgCall, MsgRun } from "@gnolang/gno-js-client";

import { WalletClient } from "@common/clients/wallet-client";

import { TransactionServiceImpl } from "./transaction-service-impl";

const account = { address: "g1caller", accountNumber: 1, sequence: 2 };

// createDocument only needs a wallet client to exist when the account is supplied.
const walletClient = {} as WalletClient;

/**
 * createDocument rebuilds every message through the SDK builders, so a field it
 * forgets to copy is lost before the document ever reaches signing.
 */
describe("TransactionServiceImpl.createDocument", () => {
  const service = new TransactionServiceImpl(null, walletClient);

  it("keeps a supplied max_deposit on a contract message", async () => {
    const document = await service.createDocument({
      messages: [
        {
          caller: "",
          send: "10ugnot",
          max_deposit: "123ugnot",
          pkg_path: "gno.land/r/demo/foo",
          func: "Bar",
          args: ["1"],
        },
      ],
      account,
    });

    const message = document.msgs[0].value as MsgCall;

    expect(document.msgs[0].type).toBe("/vm.m_call");
    expect(message.max_deposit).toBe("123ugnot");
    expect(message.send).toBe("10ugnot");
    // The caller is filled in from the account when the message leaves it empty.
    expect(message.caller).toBe("g1caller");
  });

  it("keeps a supplied max_deposit on a run message", async () => {
    const document = await service.createDocument({
      messages: [
        {
          caller: "",
          send: "10ugnot",
          max_deposit: "123ugnot",
          package: { name: "main", path: "", files: [{ name: "main.gno", body: "package main" }] },
        },
      ],
      account,
    });

    const message = document.msgs[0].value as MsgRun;

    expect(document.msgs[0].type).toBe("/vm.m_run");
    expect(message.max_deposit).toBe("123ugnot");
  });

  it("defaults max_deposit to an empty string when it is not supplied", async () => {
    const document = await service.createDocument({
      messages: [
        {
          caller: "",
          send: "",
          pkg_path: "gno.land/r/demo/foo",
          func: "Bar",
          args: [],
        },
      ],
      account,
    });

    expect((document.msgs[0].value as MsgCall).max_deposit).toBe("");
  });
});
