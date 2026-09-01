jest.mock("@constants/environment.constant", () => ({
  PACKAGE_GRC20_REGISTRY_PATH: "grc20reg_path",
  GNS_TOKEN_PATH: "gns_token_path",
  PACKAGE_LAUNCHPAD_ADDRESS: "launchpad_address",
  PACKAGE_LAUNCHPAD_PATH: "launchpad_path",
}));

import { makeExpectedApproveRunMessage } from "@common/clients/wallet-client/transaction-messages/run.test-fixtures";
import {
  makeCollectProtocolFeeMessage,
  makeDepositGNSMessageWithApproves,
} from "@repositories/launchpad/launchpad.message";

describe("launchpad.message.ts", () => {
  it("approves launchpad deposits with the exact deposit amount", async () => {
    const caller = "caller";
    const fetchAllowance = jest.fn(async () => 0);

    const messages = await makeDepositGNSMessageWithApproves(
      { poolId: "pool-1", gnsTokenAmount: 456000000n, caller, referrerAddress: null },
      fetchAllowance,
    );

    expect(messages[0]).toEqual(
      makeExpectedApproveRunMessage({
        caller,
        approves: [{ tokenPath: "gns_token_path", spenderAddress: "launchpad_address", amount: "456000000" }],
      }),
    );
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
