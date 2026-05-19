jest.mock("@constants/environment.constant", () => ({
  GNS_TOKEN_PATH: "gns_token_path",
  PACKAGE_LAUNCHPAD_ADDRESS: "launchpad_address",
  PACKAGE_LAUNCHPAD_PATH: "launchpad_path",
}));

import { makeDepositGNSMessageWithApproves } from "@repositories/launchpad/launchpad.message";

describe("launchpad.message.ts", () => {
  it("approves launchpad deposits with the exact deposit amount", async () => {
    const caller = "caller";
    const fetchAllowance = jest.fn(async () => 0);

    const messages = await makeDepositGNSMessageWithApproves(
      { poolId: "pool-1", gnsTokenAmount: 456000000n, caller, referrerAddress: null },
      fetchAllowance,
    );

    expect(messages[0]).toMatchObject({
      caller,
      pkg_path: "gns_token_path",
      func: "Approve",
      args: ["launchpad_address", "456000000"],
    });
    expect(messages[1]).toMatchObject({
      caller,
      pkg_path: "launchpad_path",
      func: "DepositGns",
      args: ["pool-1", "456000000", ""],
    });
  });
});
