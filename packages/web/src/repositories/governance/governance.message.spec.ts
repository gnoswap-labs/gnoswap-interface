jest.mock("@constants/environment.constant", () => ({
  PACKAGE_GRC20_REGISTRY_PATH: "grc20reg_path",
  GNS_TOKEN_PATH: "gns_token_path",
  PACKAGE_GOVERNANCE_PATH: "governance_path",
  PACKAGE_GOVERNANCE_STAKER_ADDRESS: "governance_staker_address",
  PACKAGE_GOVERNANCE_STAKER_PATH: "governance_staker_path",
}));

import { makeExpectedApproveRunMessage } from "@common/clients/wallet-client/transaction-messages/run.test-fixtures";
import { makeDelegateMessagesWithApproves } from "@repositories/governance/governance.message";

describe("governance.message.ts", () => {
  it("approves delegation with the exact delegated amount", async () => {
    const caller = "caller";
    const fetchAllowance = jest.fn(async () => 0);

    const messages = await makeDelegateMessagesWithApproves(
      { to: "validator", amount: "123000000", caller, referrerAddress: null },
      fetchAllowance,
    );

    expect(messages[0]).toEqual(
      makeExpectedApproveRunMessage({
        caller,
        approves: [{ tokenPath: "gns_token_path", spenderAddress: "governance_staker_address", amount: "123000000" }],
      }),
    );
    expect(messages[1]).toMatchObject({
      caller,
      pkg_path: "governance_staker_path",
      func: "Delegate",
      args: ["validator", "123000000", ""],
    });
  });
});
