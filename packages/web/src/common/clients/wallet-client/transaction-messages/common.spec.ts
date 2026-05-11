import {
  makeTransactionMessage,
  makeTransactionMessagesWithApproves,
  TokenApproveMessageInfo,
  TransactionMessage,
} from "./common";

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
      {
        caller,
        send: "",
        pkg_path: tokenPath,
        func: "Approve",
        args: [targetAddress, "100"],
        gasFee: undefined,
      },
      transactionMessage,
      {
        caller,
        send: "",
        pkg_path: tokenPath,
        func: "Approve",
        args: [targetAddress, "0"],
        gasFee: undefined,
      },
    ]);
  });

  it("resets existing allowances even when a new approve message is skipped", async () => {
    const fetchAllowance = jest.fn(async () => 2);

    const messages = await makeTransactionMessagesWithApproves([transactionMessage], approveInfos, fetchAllowance, 1);

    expect(messages).toEqual([
      transactionMessage,
      {
        caller,
        send: "",
        pkg_path: tokenPath,
        func: "Approve",
        args: [targetAddress, "0"],
        gasFee: undefined,
      },
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
      {
        caller,
        send: "",
        pkg_path: tokenPath,
        func: "Approve",
        args: [targetAddress, "100"],
        gasFee: undefined,
      },
      transactionMessage,
      {
        caller,
        send: "",
        pkg_path: tokenPath,
        func: "Approve",
        args: [targetAddress, "0"],
        gasFee: undefined,
      },
      {
        caller,
        send: "",
        pkg_path: tokenPath,
        func: "Approve",
        args: [skippedTargetAddress, "0"],
        gasFee: undefined,
      },
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
      {
        caller,
        send: "",
        pkg_path: tokenPath,
        func: "Approve",
        args: [targetAddress, "100"],
        gasFee: undefined,
      },
      transactionMessage,
    ]);
  });
});
