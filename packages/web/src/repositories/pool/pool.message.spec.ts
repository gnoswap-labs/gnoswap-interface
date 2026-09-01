import type { TokenModel } from "@models/token/token-model";

jest.mock("@constants/environment.constant", () => ({
  PACKAGE_COMMON_PATH: "common_path",
  GNS_TOKEN_PATH: "gns_token_path",
  PACKAGE_POOL_ADDRESS: "pool_address",
  PACKAGE_POOL_PATH: "pool_path",
  PACKAGE_POSITION_PATH: "position_path",
  PACKAGE_STAKER_ADDRESS: "staker_address",
  PACKAGE_STAKER_PATH: "staker_path",
  WRAPPED_GNOT_PATH: "wugnot",
  WRAPPED_GNOT_PACKAGE_PATH: "wugnot",
}));

import { isTransactionCallMessage } from "@common/clients/wallet-client/transaction-messages/common";
import { makeExpectedApproveRunMessage } from "@common/clients/wallet-client/transaction-messages/run.test-fixtures";
import {
  makeCreateExternalIncentiveMessageWithApproves,
  makeCreatePoolMessageWithApproves,
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

    expect(messages[0]).toEqual(
      makeExpectedApproveRunMessage({
        caller,
        approves: [
          { tokenPath: "tokenA_path", spenderAddress: "pool_address", amount: "1250000" },
          { tokenPath: "tokenB_path", spenderAddress: "pool_address", amount: "3000000" },
        ],
      }),
    );

    const mintMessage = messages.filter(isTransactionCallMessage).find(message => message.func === "Mint");

    expect(mintMessage).toMatchObject({
      caller,
      pkg_path: "position_path",
      func: "Mint",
    });
    expect(mintMessage?.args?.slice(0, 7)).toEqual([
      "tokenA_path",
      "tokenB_path",
      "3000",
      "-10",
      "10",
      "1250000",
      "3000000",
    ]);
  });

  it("uses the given start price as is, whichever order the token pair is passed in", async () => {
    const caller = "caller";
    const fetchAllowance = jest.fn(async () => 0);
    const request = {
      feeTier: "FEE_3000" as const,
      startPrice: "50",
      createPoolFee: 0,
      caller,
    };

    const orderedMessages = await makeCreatePoolMessageWithApproves(
      { ...request, tokenA: createTokenModel("tokenA_path"), tokenB: createTokenModel("tokenB_path") },
      fetchAllowance,
    );
    const reversedMessages = await makeCreatePoolMessageWithApproves(
      { ...request, tokenA: createTokenModel("tokenB_path"), tokenB: createTokenModel("tokenA_path") },
      fetchAllowance,
    );

    const orderedArgs = orderedMessages
      .filter(isTransactionCallMessage)
      .find(message => message.func === "CreatePool")?.args;
    const reversedArgs = reversedMessages
      .filter(isTransactionCallMessage)
      .find(message => message.func === "CreatePool")?.args;

    expect(orderedArgs?.slice(0, 3)).toEqual(["tokenA_path", "tokenB_path", "3000"]);
    expect(reversedArgs).toEqual(orderedArgs);
  });

  it("reorders mint token paths and amounts by the sorted token pair", async () => {
    const caller = "caller";
    const fetchAllowance = jest.fn(async () => 0);

    const messages = await makePositionMintMessageWithApproves(
      {
        tokenA: createTokenModel("tokenB_path"),
        tokenB: createTokenModel("tokenA_path"),
        feeTier: "FEE_3000",
        tokenAAmount: "3",
        tokenBAmount: "1.25",
        minTick: -10,
        maxTick: 20,
        slippage: 1,
        caller,
        referrerAddress: null,
      },
      fetchAllowance,
    );

    const mintMessage = messages.filter(isTransactionCallMessage).find(message => message.func === "Mint");

    expect(mintMessage?.args?.slice(0, 9)).toEqual([
      "tokenA_path",
      "tokenB_path",
      "3000",
      "-10",
      "20",
      "1250000",
      "3000000",
      "1237500",
      "2970000",
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

    expect(messages[0]).toEqual(
      makeExpectedApproveRunMessage({
        caller,
        approves: [{ tokenPath: "gns_token_path", spenderAddress: "staker_address", amount: "1750000000" }],
      }),
    );
    expect(messages[1]).toMatchObject({
      caller,
      pkg_path: "staker_path",
      func: "CreateExternalIncentive",
      args: ["pool_path", "gns_token_path", "250000000", "100", "200"],
    });
  });
});
