jest.mock("@constants/environment.constant", () => ({
  PACKAGE_GRC20_REGISTRY_PATH: "grc20reg_path",
  GNS_TOKEN_PATH: "gns_token_path",
  PACKAGE_GOVERNANCE_PATH: "governance_path",
  PACKAGE_GOVERNANCE_STAKER_ADDRESS: "governance_staker_address",
  PACKAGE_GOVERNANCE_STAKER_PATH: "governance_staker_path",
}));

import type { TokenModel } from "@models/token/token-model";
import { makeDelegateMessagesWithApproves, makeUnDelegateMessages } from "@repositories/governance/governance.message";

describe("governance.message.ts", () => {
  it("approves delegation with the exact delegated amount", async () => {
    const caller = "caller";
    const fetchAllowance = jest.fn(async () => 0);
    const gnsToken = {
      path: "gns_token_path",
      pkgPath: "gns_package_path",
      routes: { funcs: { approve: { name: "Approve", args: ["$spender", "$amount"] } } },
    } as TokenModel;

    const messages = await makeDelegateMessagesWithApproves(
      { to: "validator", gnsToken, amount: "123000000", caller, referrerAddress: null },
      fetchAllowance,
    );

    expect(messages[0]).toMatchObject({
      caller,
      pkg_path: "gns_package_path",
      func: "Approve",
      args: ["governance_staker_address", "123000000"],
    });
    expect(messages[1]).toMatchObject({
      caller,
      pkg_path: "governance_staker_path",
      func: "Delegate",
      args: ["validator", "123000000", ""],
    });
  });

  it("creates a single Undelegate message without collecting rewards", () => {
    const caller = "caller";

    const messages = makeUnDelegateMessages({ to: "validator", amount: "123000000", caller });

    expect(messages).toEqual([
      {
        caller,
        send: "",
        pkg_path: "governance_staker_path",
        func: "Undelegate",
        args: ["validator", "123000000"],
        gasFee: undefined,
      },
    ]);
  });
});
