import {
  makeTokenApproveMessages,
  makeTransactionMessage,
  makeTransactionMessagesWithApproves,
  TokenApproveMessageInfo,
  TransactionMessage,
} from "./common";
import { makeExpectedApproveRunMessage } from "./run.test-fixtures";

describe("makeTransactionMessagesWithApproves", () => {
  const caller = "caller";
  const targetAddress = "target";
  const tokenPath = "token_path";

  const transactionMessage: TransactionMessage = makeTransactionMessage({
    caller,
    send: "",
    packagePath: "contract_path",
    func: "Execute",
    args: ["argument"],
  });

  const approveInfos: TokenApproveMessageInfo[] = [
    {
      tokenPath,
      targetAddress,
      amount: "100",
      caller,
    },
  ];

  it("adds approve reset messages after transactions by default", async () => {
    const fetchAllowance = jest.fn(async () => 0);

    const messages = await makeTransactionMessagesWithApproves([transactionMessage], approveInfos, fetchAllowance);

    expect(messages).toEqual([
      makeExpectedApproveRunMessage({
        caller,
        approves: [{ tokenPath, spenderAddress: targetAddress, amount: "100" }],
      }),
      transactionMessage,
      makeExpectedApproveRunMessage({ caller, approves: [{ tokenPath, spenderAddress: targetAddress, amount: "0" }] }),
    ]);
  });

  it("resets existing allowances even when a new approve message is skipped", async () => {
    const fetchAllowance = jest.fn(async () => 2);

    const messages = await makeTransactionMessagesWithApproves([transactionMessage], approveInfos, fetchAllowance, 1);

    expect(messages).toEqual([
      transactionMessage,
      makeExpectedApproveRunMessage({ caller, approves: [{ tokenPath, spenderAddress: targetAddress, amount: "0" }] }),
    ]);
  });

  it("resets all required allowances when only some need a new approve message", async () => {
    const skippedTargetAddress = "skipped_target";
    const approveInfosWithMixedAllowances: TokenApproveMessageInfo[] = [
      ...approveInfos,
      {
        tokenPath,
        targetAddress: skippedTargetAddress,
        amount: "200",
        caller,
      },
    ];
    const fetchAllowance = jest.fn(async (...args: [string, string, string]) => {
      const spender = args[2];
      return spender === skippedTargetAddress ? 2 : 0;
    });

    const messages = await makeTransactionMessagesWithApproves(
      [transactionMessage],
      approveInfosWithMixedAllowances,
      fetchAllowance,
      1,
    );

    expect(messages).toEqual([
      makeExpectedApproveRunMessage({
        caller,
        approves: [{ tokenPath, spenderAddress: targetAddress, amount: "100" }],
      }),
      transactionMessage,
      makeExpectedApproveRunMessage({
        caller,
        approves: [
          { tokenPath, spenderAddress: targetAddress, amount: "0" },
          { tokenPath, spenderAddress: skippedTargetAddress, amount: "0" },
        ],
      }),
    ]);
  });

  it("keeps reset messages disabled when explicitly requested", async () => {
    const fetchAllowance = jest.fn(async () => 0);

    const messages = await makeTransactionMessagesWithApproves(
      [transactionMessage],
      approveInfos,
      fetchAllowance,
      1,
      false,
    );

    expect(messages).toEqual([
      makeExpectedApproveRunMessage({
        caller,
        approves: [{ tokenPath, spenderAddress: targetAddress, amount: "100" }],
      }),
      transactionMessage,
    ]);
  });

  it("uses common realm Approve for IBC token approve and reset messages", async () => {
    const ibcTokenPath =
      "gno.land/r/aib/ibc/apps/transfer.9C935EC805585DF5162725E2C857BF2F5E390F2418B3DB7595448A5485BC6F8A";
    const fetchAllowance = jest.fn(async () => 0);

    const messages = await makeTransactionMessagesWithApproves(
      [transactionMessage],
      [
        {
          tokenPath: ibcTokenPath,
          targetAddress,
          amount: "100",
          caller,
        },
      ],
      fetchAllowance,
    );

    expect(messages).toEqual([
      makeExpectedApproveRunMessage({
        caller,
        approves: [{ tokenPath: ibcTokenPath, spenderAddress: targetAddress, amount: "100" }],
      }),
      transactionMessage,
      makeExpectedApproveRunMessage({
        caller,
        approves: [{ tokenPath: ibcTokenPath, spenderAddress: targetAddress, amount: "0" }],
      }),
    ]);
  });

  it("uses resource route metadata for approve and reset messages", async () => {
    const tokenPath = "gno.land/r/example/factory.FOO";
    const fetchAllowance = jest.fn(async () => 0);
    const routes = {
      funcs: {
        approve: { name: "SetAllowance", args: ["FOO", "$spender", "$amount"] },
      },
    };

    const messages = await makeTransactionMessagesWithApproves(
      [transactionMessage],
      [
        {
          tokenPath,
          pkgPath: "gno.land/r/example/factory",
          routes,
          targetAddress,
          amount: "100",
          caller,
        },
      ],
      fetchAllowance,
    );

    expect(messages).toEqual([
      makeTransactionMessage({
        caller,
        send: "",
        packagePath: "gno.land/r/example/factory",
        func: "SetAllowance",
        args: ["FOO", targetAddress, "100"],
      }),
      transactionMessage,
      makeTransactionMessage({
        caller,
        send: "",
        packagePath: "gno.land/r/example/factory",
        func: "SetAllowance",
        args: ["FOO", targetAddress, "0"],
      }),
    ]);
  });
});

describe("makeTokenApproveMessages", () => {
  const caller = "caller";
  const targetAddress = "target";
  const wugnotTokenKey = "gno.land/r/gnoland/wugnot.wugnot";

  it("keeps tokens with routes as MsgCall and batches the rest into run messages in order", () => {
    const messages = makeTokenApproveMessages([
      { tokenPath: "token_a", targetAddress, amount: "1", caller },
      { tokenPath: "token_b", targetAddress, amount: "2", caller },
      {
        tokenPath: wugnotTokenKey,
        pkgPath: "gno.land/r/gnoland/wugnot",
        routes: { funcs: { approve: { name: "Approve", args: ["$spender", "$amount"] } } },
        targetAddress,
        amount: "3",
        caller,
      },
      { tokenPath: "token_c", targetAddress, amount: "4", caller },
    ]);

    expect(messages).toEqual([
      makeExpectedApproveRunMessage({
        caller,
        approves: [
          { tokenPath: "token_a", spenderAddress: targetAddress, amount: "1" },
          { tokenPath: "token_b", spenderAddress: targetAddress, amount: "2" },
        ],
      }),
      makeTransactionMessage({
        caller,
        send: "",
        packagePath: "gno.land/r/gnoland/wugnot",
        func: "Approve",
        args: [targetAddress, "3"],
      }),
      makeExpectedApproveRunMessage({
        caller,
        approves: [{ tokenPath: "token_c", spenderAddress: targetAddress, amount: "4" }],
      }),
    ]);
  });
});
