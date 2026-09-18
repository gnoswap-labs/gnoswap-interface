jest.mock("@constants/environment.constant", () => ({
  PACKAGE_GRC20_REGISTRY_PATH: "grc20reg_path",
  GNS_TOKEN_PATH: "gns_token_path",
  PACKAGE_LAUNCHPAD_ADDRESS: "launchpad_address",
  PACKAGE_LAUNCHPAD_PATH: "launchpad_path",
}));

import type { TokenModel } from "@models/token/token-model";
import {
  makeCollectProtocolFeeMessage,
  makeDepositGNSMessageWithApproves,
} from "@repositories/launchpad/launchpad.message";

describe("launchpad.message.ts", () => {
  it("approves launchpad deposits with the exact deposit amount", async () => {
    const caller = "caller";
    const fetchAllowance = jest.fn(async () => 0);
    const gnsToken = {
      path: "gns_token_path",
      pkgPath: "gns_package_path",
      routes: { funcs: { approve: { name: "Approve", args: ["$spender", "$amount"] } } },
    } as TokenModel;

    const messages = await makeDepositGNSMessageWithApproves(
      { poolId: "pool-1", gnsToken, gnsTokenAmount: 456000000n, caller, referrerAddress: null },
      fetchAllowance,
    );

    expect(messages[0]).toMatchObject({
      caller,
      pkg_path: "gns_package_path",
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

  it("builds a collect protocol fee message", () => {
    const caller = "caller";

    const messages = makeCollectProtocolFeeMessage({ caller });

    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({
      caller,
      pkg_path: "launchpad_path",
      send: "",
      func: "CollectProtocolFee",
      args: [],
    });
  });
});
