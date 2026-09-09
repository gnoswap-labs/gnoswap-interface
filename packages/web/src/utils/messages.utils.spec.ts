import { mappedTransactionData, createDocument, mappedDocumentMessagesWithCaller } from "./messages.utils";
import { Document, ContractMessage } from "src/types/transaction-messages.types";
import { MsgCall, MsgSend, MsgAddPackage } from "@gnolang/gno-js-client";
import { MsgRun } from "@gnolang/gno-js-client/bin/proto/gno/vm";

describe("messages.utils", () => {
  describe("createDocument", () => {
    it("should create a document with the correct structure", () => {
      const msgCall: ContractMessage = {
        type: "/vm.m_call",
        value: MsgCall.create({
          caller: "g1234567890",
          send: "",
          pkg_path: "gno.land/r/demo/foo",
          func: "bar",
          args: ["test"],
        }),
      };

      const args = {
        accountSequence: 1,
        accountNumber: 123,
        chainId: "test-chain",
        messages: [msgCall],
        gasWanted: 1000000,
        gasFee: 100000,
        memo: "test memo",
      };

      const document = createDocument(args);

      expect(document).toEqual({
        msgs: [msgCall],
        fee: {
          amount: [
            {
              amount: "100000",
              denom: "ugnot",
            },
          ],
          gas: "1300000",
        },
        chain_id: "test-chain",
        memo: "test memo",
        account_number: "123",
        sequence: "1",
      });
    });

    it("should handle empty memo", () => {
      const msgSend: ContractMessage = {
        type: "/bank.MsgSend",
        value: MsgSend.create({
          from_address: "g1sender",
          to_address: "g1receiver",
          amount: "1000ugnot",
        }),
      };

      const args = {
        accountSequence: 2,
        accountNumber: 456,
        chainId: "test-chain",
        messages: [msgSend],
        gasWanted: 500000,
        gasFee: 50000,
      };

      const document = createDocument(args);

      expect(document.memo).toBe("");
    });
  });

  describe("mappedTransactionData", () => {
    it("keeps an unknown message as a placeholder without changing the signing document", () => {
      const knownMessage: ContractMessage = {
        type: "/bank.MsgSend",
        value: MsgSend.create({ from_address: "g1sender", to_address: "g1receiver", amount: "1000ugnot" }),
      };
      const document = createDocument({
        accountSequence: 1,
        accountNumber: 1,
        chainId: "test-chain",
        messages: [knownMessage],
        gasWanted: 1000,
        gasFee: 1,
      });
      // Simulate an unexpected runtime payload outside the supported message union.
      document.msgs.unshift(JSON.parse("{\"type\":\"/vm.future\",\"value\":{\"data\":\"preserved\"}}"));
      const original = JSON.stringify(document);

      const result = mappedTransactionData(document);

      expect(result.contracts).toEqual([
        { type: "unknown", rawType: "/vm.future", function: "", value: {} },
        { ...knownMessage, function: "Transfer" },
      ]);
      expect(result.messages).toBe(document.msgs);
      expect(result.document).toBe(document);
      expect(JSON.stringify(document)).toBe(original);
    });

    it("preserves package display fields for deployment and run messages", () => {
      const packageData = { name: "test", path: "gno.land/r/demo/test", files: [] };
      const messages: ContractMessage[] = [
        { type: "/vm.m_addpkg", value: MsgAddPackage.create({ creator: "g1creator", package: packageData }) },
        { type: "/vm.m_run", value: MsgRun.create({ caller: "g1caller", send: "", package: packageData }) },
      ];
      const document = createDocument({
        accountSequence: 1,
        accountNumber: 1,
        chainId: "test-chain",
        messages,
        gasWanted: 1000,
        gasFee: 1,
      });

      expect(mappedTransactionData(document).contracts).toEqual([
        { type: "/vm.m_addpkg", function: "AddPackage", value: { creator: "g1creator", package: packageData } },
        { type: "/vm.m_run", function: "Run", value: { caller: "g1caller", send: "", package: packageData } },
      ]);
      expect(mappedTransactionData({ ...document, msgs: [] }).contracts).toEqual([]);
    });

    it("should map document to transaction data", () => {
      const msgCall: ContractMessage = {
        type: "/vm.m_call",
        value: MsgCall.create({
          caller: "g1234567890",
          send: "1000ugnot",
          pkg_path: "gno.land/r/demo/foo",
          func: "transfer",
          args: ["g1receiver", "100"],
        }),
      };

      const document: Document = {
        chain_id: "test-chain",
        account_number: "123",
        sequence: "1",
        fee: {
          amount: [{ denom: "ugnot", amount: "100000" }],
          gas: "1000000",
        },
        msgs: [msgCall],
        memo: "test memo",
      };

      const transactionData = mappedTransactionData(document);

      expect(transactionData.messages).toEqual([msgCall]);
      expect(transactionData.contracts).toHaveLength(1);
      expect(transactionData.contracts[0]).toEqual({
        type: "/vm.m_call",
        function: "transfer",
        value: {
          caller: "g1234567890",
          send: "1000ugnot",
          pkg_path: "gno.land/r/demo/foo",
          func: "transfer",
          args: ["g1receiver", "100"],
        },
      });
      expect(transactionData.gasWanted).toBe("1000000");
      expect(transactionData.gasFee).toBe("100000ugnot");
      expect(transactionData.memo).toBe("test memo");
      expect(transactionData.document).toEqual(document);
    });

    it("should handle MsgSend correctly", () => {
      const msgSend: ContractMessage = {
        type: "/bank.MsgSend",
        value: MsgSend.create({
          from_address: "g1sender",
          to_address: "g1receiver",
          amount: "1000ugnot",
        }),
      };

      const document: Document = {
        chain_id: "test-chain",
        account_number: "123",
        sequence: "1",
        fee: {
          amount: [{ denom: "ugnot", amount: "50000" }],
          gas: "500000",
        },
        msgs: [msgSend],
        memo: "",
      };

      const transactionData = mappedTransactionData(document);

      expect(transactionData.contracts[0].function).toBe("Transfer");
    });
  });

  describe("mappedDocumentMessagesWithCaller", () => {
    const currentAddress = "g1currentuser";

    it("should add caller to MsgCall if not present", () => {
      const msgCall: ContractMessage = {
        type: "/vm.m_call",
        value: MsgCall.create({
          caller: "",
          send: "",
          pkg_path: "gno.land/r/demo/foo",
          func: "bar",
          args: [],
        }),
      };

      const result = mappedDocumentMessagesWithCaller([msgCall], currentAddress);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe("/vm.m_call");
      expect(result[0].type === "/vm.m_call" && result[0].value.caller).toBe(currentAddress);
    });

    it("should preserve existing caller in MsgCall", () => {
      const existingCaller = "g1existingcaller";
      const msgCall: ContractMessage = {
        type: "/vm.m_call",
        value: MsgCall.create({
          caller: existingCaller,
          send: "",
          pkg_path: "gno.land/r/demo/foo",
          func: "bar",
          args: [],
        }),
      };

      const result = mappedDocumentMessagesWithCaller([msgCall], currentAddress);

      expect((result[0].value as MsgCall).caller).toBe(existingCaller);
    });

    it("should add from_address to MsgSend if not present", () => {
      const msgSend: ContractMessage = {
        type: "/bank.MsgSend",
        value: MsgSend.create({
          from_address: "",
          to_address: "g1receiver",
          amount: "1000ugnot",
        }),
      };

      const result = mappedDocumentMessagesWithCaller([msgSend], currentAddress);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe("/bank.MsgSend");
      expect((result[0].value as MsgSend).from_address).toBe(currentAddress);
    });

    it("should add creator to MsgAddPackage if not present", () => {
      const msgAddPackage: ContractMessage = {
        type: "/vm.m_addpkg",
        value: MsgAddPackage.create({
          creator: "",
          package: {
            name: "test",
            path: "gno.land/p/demo/test",
            files: [],
          },
          send: "",
        }),
      };

      const result = mappedDocumentMessagesWithCaller([msgAddPackage], currentAddress);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe("/vm.m_addpkg");
      expect((result[0].value as MsgAddPackage).creator).toBe(currentAddress);
    });

    it("should add caller to MsgRun if not present", () => {
      const msgRun: ContractMessage = {
        type: "/vm.m_run",
        value: MsgRun.create({
          caller: "",
          send: "",
          package: {
            name: "test",
            path: "",
            files: [],
          },
        }),
      };

      const result = mappedDocumentMessagesWithCaller([msgRun], currentAddress);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe("/vm.m_run");
      expect((result[0].value as MsgRun).caller).toBe(currentAddress);
    });

    it("should handle empty messages array", () => {
      const result = mappedDocumentMessagesWithCaller([], currentAddress);
      expect(result).toEqual([]);
    });

    it("should handle multiple messages", () => {
      const messages: ContractMessage[] = [
        {
          type: "/bank.MsgSend",
          value: MsgSend.create({
            from_address: "",
            to_address: "g1receiver",
            amount: "1000ugnot",
          }),
        },
        {
          type: "/vm.m_call",
          value: MsgCall.create({
            caller: "",
            send: "",
            pkg_path: "gno.land/r/demo/foo",
            func: "bar",
            args: [],
          }),
        },
      ];

      const result = mappedDocumentMessagesWithCaller(messages, currentAddress);

      expect(result).toHaveLength(2);
      expect((result[0].value as MsgSend).from_address).toBe(currentAddress);
      expect((result[1].value as MsgCall).caller).toBe(currentAddress);
    });
  });
});
