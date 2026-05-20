import type { TokenModel } from "@models/token/token-model";

jest.mock("@constants/environment.constant", () => ({
  GNS_TOKEN_PATH: "gns_token_path",
  PACKAGE_POOL_ADDRESS: "pool_address",
  PACKAGE_POOL_PATH: "pool_path",
  PACKAGE_POSITION_PATH: "position_path",
  PACKAGE_STAKER_ADDRESS: "staker_address",
  PACKAGE_STAKER_PATH: "staker_path",
  WRAPPED_GNOT_PATH: "wugnot",
}));

import {
  makeCreateExternalIncentiveMessageWithApproves,
  makePositionMintMessageWithApproves,
} from "@repositories/pool/pool.message";

const createTokenModel = (path: string, type: TokenModel["type"] = "GRC20"): TokenModel => ({
  path,
  type,
  chainId: "dev.gnoswap",
  createdAt: "2024-01-24T15:12:21Z",
  name: path,
  symbol: path,
  displaySymbol: path,
  decimals: 6,
  logoURI: "",
  priceID: path,
});

describe("pool.message.ts", () => {
  it("approves mint tokens using exact desired raw amounts", async () => {
    const caller = "caller";
    const fetchAllowance = jest.fn(async () => 0);

    const messages = await makePositionMintMessageWithApproves(
      {
        tokenA: createTokenModel("tokenA_path"),
        tokenB: createTokenModel("tokenB_path"),
        feeTier: "FEE_3000",
        tokenAAmount: "1.25",
        tokenBAmount: "3",
        minTick: -10,
        maxTick: 10,
        slippage: 0,
        caller,
        referrerAddress: null,
      },
      fetchAllowance,
    );

    expect(messages[0]).toMatchObject({
      caller,
      pkg_path: "tokenA_path",
      func: "Approve",
      args: ["pool_address", "1250000"],
    });
    expect(messages[1]).toMatchObject({
      caller,
      pkg_path: "tokenB_path",
      func: "Approve",
      args: ["pool_address", "3000000"],
    });
    expect(messages[2]).toMatchObject({
      caller,
      pkg_path: "position_path",
      func: "Mint",
    });
    expect(messages[2].args?.slice(0, 7)).toEqual([
      "tokenA_path",
      "tokenB_path",
      "3000",
      "-10",
      "10",
      "1250000",
      "3000000",
    ]);
  });

  it("sums GNS incentive reward and creation deposit approvals for the same spender", async () => {
    const caller = "caller";
    const fetchAllowance = jest.fn(async () => 0);

    const messages = await makeCreateExternalIncentiveMessageWithApproves(
      {
        poolPath: "pool_path",
        rewardToken: createTokenModel("gns_token_path"),
        rewardAmount: "250",
        incentiveCreationDepositGnsAmount: "1500000000",
        startTime: 100,
        endTime: 200,
        caller,
      },
      fetchAllowance,
    );

    expect(messages[0]).toMatchObject({
      caller,
      pkg_path: "gns_token_path",
      func: "Approve",
      args: ["staker_address", "1750000000"],
    });
    expect(messages[1]).toMatchObject({
      caller,
      pkg_path: "staker_path",
      func: "CreateExternalIncentive",
      args: ["pool_path", "gns_token_path", "250000000", "100", "200"],
    });
  });
});
