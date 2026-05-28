import type { RewardType } from "@constants/option.constant";
import type { PoolPositionModel } from "@models/position/pool-position-model";
import type { PositionModel } from "@models/position/position-model";
import type { RewardModel } from "@models/position/reward-model";
import type { TokenModel } from "@models/token/token-model";
import type { TransactionMessage } from "@common/clients/wallet-client/transaction-messages/common";
import BigNumber from "bignumber.js";

jest.mock("@constants/environment.constant", () => ({
  // GNOT wrapper
  WRAPPED_GNOT_PATH: "wugnot",

  // Package addresses / paths
  PACKAGE_POOL_ADDRESS: "pool_address",
  PACKAGE_POSITION_ADDRESS: "position_address",
  PACKAGE_POSITION_PATH: "position_path",
  PACKAGE_STAKER_ADDRESS: "staker_address",
  PACKAGE_STAKER_PATH: "staker_path",
  PACKAGE_POOL_PATH: "pool_path",
  PACKAGE_NFT_PATH: "nft_path",

  // Used by token-constant exports (not essential for these tests)
  GNS_TOKEN_PATH: "gns_token_path",
  XGNS_TOKEN_PATH: "xgns_token_path",
}));

import {
  makeClaimAllMessageWithApproves,
  makeClaimMessageWithApproves,
  makeDecreaseLiquidityMessagesWithApproves,
  makeIncreaseLiquidityMessagesWithApproves,
  makeRemoveLiquidityMessagesWithApproves,
  makeRepositionLiquidityMessagesWithApproves,
  makeStakePositionsMessagesWithApproves,
  makeUnStakePositionsMessagesWithApproves,
} from "@repositories/position/position.message";

type RewardOverrides = {
  rewardType: RewardType;
  rewardTokenPath: string;
  claimableAmount: string;
};

const createTokenModel = (
  path: string,
  type: TokenModel["type"] = "GRC20",
  overrides?: Partial<TokenModel>,
): TokenModel => {
  return {
    path,
    type,
    chainId: "dev.gnoswap",
    createdAt: "2024-01-24T15:12:21Z",
    name: "Test Token",
    symbol: "TT",
    displaySymbol: "TT",
    decimals: 6,
    logoURI: "",
    priceID: path,
    ...overrides,
    tokenId: overrides?.tokenId ?? `${path}.${path}`,
  };
};

const createReward = ({ rewardType, rewardTokenPath, claimableAmount }: RewardOverrides): RewardModel => {
  const rewardToken: RewardModel["rewardToken"] = {
    ...createTokenModel(rewardTokenPath, rewardTokenPath === "ugnot" ? "Native" : "GRC20"),
    rewardType,
  };

  return {
    rewardToken,
    totalAmount: "100",
    claimableAmount,
    claimableUsd: "0",
    accuReward1D: null,
    apr: null,
  };
};

const createPosition = (lpTokenId: string, rewards: RewardModel[]): PositionModel => {
  return {
    id: 1,
    lpTokenId,
    poolPath: "pool_path",
    staked: false,
    owner: "owner",
    tickLower: 0,
    tickUpper: 0,
    liquidity: 0n,
    tokenABalance: "0",
    tokenBBalance: "0",
    positionUsdValue: "0",
    unclaimedFeeAAmount: "0",
    unclaimedFeeBAmount: "0",
    apr: "0",
    stakedAt: "",
    rewards,
    claimedRewards: [],
    closed: false,
    totalClaimedUsd: "0",
    usdValue: 0,
    tokenUri: "",
    totalDailyRewardsUsd: "0",
    stakedUsdValue: "0",
  };
};

const createPoolPosition = (lpTokenId: string, rewards: RewardModel[]): PoolPositionModel => {
  return {
    ...(createPosition(lpTokenId, rewards) as unknown as PositionModel),
    feeTier: "NONE",
    pool: {} as unknown as PoolPositionModel["pool"],
  };
};

const splitMessagesByApproveReset = (
  messages: TransactionMessage[],
  approveCount: number,
  resetCount: number = approveCount,
) => {
  return {
    approveMessages: messages.slice(0, approveCount),
    txMessages: messages.slice(approveCount, messages.length - resetCount),
    resetMessages: resetCount > 0 ? messages.slice(messages.length - resetCount) : [],
  };
};

const toResetApproveMessage = (message: TransactionMessage): TransactionMessage => {
  const targetAddress = message.args?.[0];

  if (message.func !== "Approve" || !targetAddress) {
    throw new Error("Approve message must include a target address");
  }

  return {
    ...message,
    args: [targetAddress, "0"],
  };
};

const expectResetMessages = (resetMessages: TransactionMessage[], approveMessages: TransactionMessage[]) => {
  expect(resetMessages).toEqual(approveMessages.map(toResetApproveMessage));
};

describe("position.message.ts", () => {
  describe("makeStakePositionsMessagesWithApproves", () => {
    it("creates NFT approve + StakeToken messages in order", () => {
      const lpTokenIds = ["1", "2"];
      const caller = "caller";
      const referrerAddress = "referrer";

      const messages = makeStakePositionsMessagesWithApproves({ lpTokenIds, caller, referrerAddress });

      expect(messages).toEqual([
        {
          caller,
          send: "",
          pkg_path: "nft_path",
          func: "Approve",
          args: ["staker_address", "1"],
          gasFee: undefined,
        },
        {
          caller,
          send: "",
          pkg_path: "staker_path",
          func: "StakeToken",
          args: ["1", referrerAddress],
          gasFee: undefined,
        },
        {
          caller,
          send: "",
          pkg_path: "nft_path",
          func: "Approve",
          args: ["staker_address", "2"],
          gasFee: undefined,
        },
        {
          caller,
          send: "",
          pkg_path: "staker_path",
          func: "StakeToken",
          args: ["2", referrerAddress],
          gasFee: undefined,
        },
      ]);
    });

    it("uses empty referrer when referrerAddress is null", () => {
      const lpTokenIds = ["1"];
      const caller = "caller";

      const messages = makeStakePositionsMessagesWithApproves({ lpTokenIds, caller, referrerAddress: null });

      expect(messages[1]).toMatchObject({
        func: "StakeToken",
        args: ["1", ""],
      });
    });
  });

  describe("makeClaimMessageWithApproves", () => {
    const tokenFee = "fee_token";
    const tokenStaking = "ugnot";

    it("creates fee + staking collect tx messages without token approve messages", async () => {
      const caller = "caller";
      const position = createPosition("lp1", [
        createReward({ rewardType: "SWAP_FEE", rewardTokenPath: tokenFee, claimableAmount: "0" }),
        createReward({ rewardType: "EXTERNAL_REWARD", rewardTokenPath: tokenStaking, claimableAmount: "0" }),
      ]);

      const fetchAllowance = jest.fn(async () => 0);
      const messages = await makeClaimMessageWithApproves({ position, caller }, fetchAllowance);

      const { approveMessages, txMessages, resetMessages } = splitMessagesByApproveReset(messages, 0, 0);

      expect(approveMessages).toHaveLength(0);

      expect(txMessages).toEqual([
        {
          caller,
          send: "",
          pkg_path: "position_path",
          func: "CollectFee",
          args: ["lp1"],
          gasFee: undefined,
        },
        {
          caller,
          send: "",
          pkg_path: "staker_path",
          func: "CollectReward",
          args: ["lp1"],
          gasFee: undefined,
        },
      ]);
      expect(resetMessages).toHaveLength(0);
      expect(fetchAllowance).not.toHaveBeenCalled();
    });

    it("does not fetch allowance for fee claims because no approval is required", async () => {
      const caller = "caller";
      const position = createPosition("lp1", [
        createReward({ rewardType: "SWAP_FEE", rewardTokenPath: "fee_token", claimableAmount: "0" }),
      ]);

      const fetchAllowance = jest.fn(async () => 0);
      const messages = await makeClaimMessageWithApproves({ position, caller }, fetchAllowance);
      const { approveMessages, txMessages, resetMessages } = splitMessagesByApproveReset(messages, 0, 0);

      expect(approveMessages).toHaveLength(0);

      expect(txMessages).toEqual([
        {
          caller,
          send: "",
          pkg_path: "position_path",
          func: "CollectFee",
          args: ["lp1"],
          gasFee: undefined,
        },
      ]);
      expect(resetMessages).toHaveLength(0);
      expect(fetchAllowance).not.toHaveBeenCalled();
    });
  });

  describe("makeClaimAllMessageWithApproves", () => {
    it("does not create CollectFee tx when SWAP_FEE claimableAmount <= 0", async () => {
      const caller = "caller";
      const positions = [
        createPosition("lp1", [
          createReward({ rewardType: "SWAP_FEE", rewardTokenPath: "fee_token", claimableAmount: "0" }),
          createReward({ rewardType: "EXTERNAL_REWARD", rewardTokenPath: "ugnot", claimableAmount: "0" }),
        ]),
      ];

      const fetchAllowance = jest.fn(async () => 0);
      const messages = await makeClaimAllMessageWithApproves({ positions, caller }, fetchAllowance);

      const { approveMessages, txMessages, resetMessages } = splitMessagesByApproveReset(messages, 0, 0);

      expect(approveMessages).toHaveLength(0);

      // Only CollectReward should exist (no CollectFee because claimableAmount <= 0).
      expect(txMessages).toEqual([
        {
          caller,
          send: "",
          pkg_path: "staker_path",
          func: "CollectReward",
          args: ["lp1"],
          gasFee: undefined,
        },
      ]);
      expect(resetMessages).toHaveLength(0);
      expect(fetchAllowance).not.toHaveBeenCalled();
    });

    it("creates CollectFee messages across multiple positions without approve messages", async () => {
      const caller = "caller";

      const positions = [
        createPosition("lp1", [
          createReward({ rewardType: "SWAP_FEE", rewardTokenPath: "fee_token", claimableAmount: "10" }),
        ]),
        createPosition("lp2", [
          createReward({ rewardType: "SWAP_FEE", rewardTokenPath: "fee_token", claimableAmount: "20" }),
        ]),
      ];

      const fetchAllowance = jest.fn(async () => 0);
      const messages = await makeClaimAllMessageWithApproves({ positions, caller }, fetchAllowance);

      const { approveMessages, txMessages, resetMessages } = splitMessagesByApproveReset(messages, 0, 0);

      expect(approveMessages).toHaveLength(0);

      expect(txMessages).toEqual([
        {
          caller,
          send: "",
          pkg_path: "position_path",
          func: "CollectFee",
          args: ["lp1"],
          gasFee: undefined,
        },
        {
          caller,
          send: "",
          pkg_path: "position_path",
          func: "CollectFee",
          args: ["lp2"],
          gasFee: undefined,
        },
      ]);
      expect(resetMessages).toHaveLength(0);
      expect(fetchAllowance).not.toHaveBeenCalled();
    });
  });

  describe("makeUnStakePositionsMessagesWithApproves", () => {
    it("creates one UnStakeToken per position without token approve messages", async () => {
      const caller = "caller";

      const positions: PoolPositionModel[] = [
        createPoolPosition("lp1", [
          createReward({ rewardType: "EXTERNAL_REWARD", rewardTokenPath: "wugnot", claimableAmount: "0" }),
        ]),
        createPoolPosition("lp2", [
          createReward({ rewardType: "INTERNAL_TIER_1", rewardTokenPath: "wugnot", claimableAmount: "0" }),
        ]),
      ];

      const fetchAllowance = jest.fn(async () => 0);
      const messages = await makeUnStakePositionsMessagesWithApproves({ positions, caller }, fetchAllowance);

      const { approveMessages, txMessages, resetMessages } = splitMessagesByApproveReset(messages, 0, 0);

      expect(approveMessages).toHaveLength(0);

      expect(txMessages).toEqual([
        {
          caller,
          send: "",
          pkg_path: "staker_path",
          func: "UnStakeToken",
          args: ["lp1"],
          gasFee: undefined,
        },
        {
          caller,
          send: "",
          pkg_path: "staker_path",
          func: "UnStakeToken",
          args: ["lp2"],
          gasFee: undefined,
        },
      ]);
      expect(resetMessages).toHaveLength(0);
      expect(fetchAllowance).not.toHaveBeenCalled();
    });
  });

  describe("makeIncreaseLiquidityMessagesWithApproves", () => {
    it("creates optional Deposit message and IncreaseLiquidity tx, plus required approves", async () => {
      const caller = "caller";
      const lpTokenId = "lp1";
      const deadline = "deadline";

      const tokenA: TokenModel = createTokenModel("ugnot", "Native");
      const tokenB: TokenModel = createTokenModel("tokenB_path", "GRC20");

      const fetchAllowance = jest.fn(async () => 0);
      const messages = await makeIncreaseLiquidityMessagesWithApproves(
        {
          lpTokenId,
          tokenA,
          tokenB,
          tokenAAmount: 0.0025,
          tokenBAmount: 3,
          caller,
          slippage: 0,
          deadline,
        },
        fetchAllowance,
      );

      const { approveMessages, txMessages, resetMessages } = splitMessagesByApproveReset(messages, 2);

      expect(approveMessages).toHaveLength(2);
      expect(approveMessages).toEqual(
        expect.arrayContaining([
          {
            caller,
            send: "",
            pkg_path: "wugnot",
            func: "Approve",
            args: ["pool_address", "2500"],
            gasFee: undefined,
          },
          {
            caller,
            send: "",
            pkg_path: "tokenB_path",
            func: "Approve",
            args: ["pool_address", "3000000"],
            gasFee: undefined,
          },
        ]),
      );

      expect(txMessages).toEqual([
        {
          caller,
          send: "2500ugnot",
          pkg_path: "wugnot",
          func: "Deposit",
          args: null,
          gasFee: undefined,
        },
        {
          caller,
          send: "",
          pkg_path: "position_path",
          func: "IncreaseLiquidity",
          args: ["lp1", "2500", "3000000", "2500", "3000000", deadline],
          gasFee: undefined,
        },
      ]);
      expectResetMessages(resetMessages, approveMessages);
    });
  });

  describe("makeDecreaseLiquidityMessagesWithApproves", () => {
    it("creates DecreaseLiquidity tx without token approve messages", async () => {
      const caller = "caller";
      const lpTokenId = "lp1";
      const deadline = "deadline";

      const tokenA: TokenModel = createTokenModel("ugnot", "Native");
      const tokenB: TokenModel = createTokenModel("tokenB_path", "GRC20");

      const fetchAllowance = jest.fn(async () => 0);
      const messages = await makeDecreaseLiquidityMessagesWithApproves(
        {
          lpTokenId,
          calculatedLiquidity: "1234",
          tokenA,
          tokenB,
          tokenAAmount: 1000,
          tokenBAmount: 2000,
          slippage: 0,
          caller,
          deadline,
        },
        fetchAllowance,
      );

      const { approveMessages, txMessages, resetMessages } = splitMessagesByApproveReset(messages, 0, 0);

      expect(approveMessages).toHaveLength(0);

      expect(txMessages).toEqual([
        {
          caller,
          send: "",
          pkg_path: "position_path",
          func: "DecreaseLiquidity",
          args: ["lp1", "1234", "1000", "2000", deadline],
          gasFee: undefined,
        },
      ]);
      expect(resetMessages).toHaveLength(0);
      expect(fetchAllowance).not.toHaveBeenCalled();
    });
  });

  describe("makeRepositionLiquidityMessagesWithApproves", () => {
    it("creates optional Deposit message and Reposition tx, plus required approves", async () => {
      const caller = "caller";
      const lpTokenId = "lp1";
      const deadline = "deadline";

      const tokenA: TokenModel = createTokenModel("ugnot", "Native");
      const tokenB: TokenModel = createTokenModel("tokenB_path", "GRC20");

      const fetchAllowance = jest.fn(async () => 0);
      const messages = await makeRepositionLiquidityMessagesWithApproves(
        {
          lpTokenId,
          tokenA,
          tokenB,
          tokenAAmount: "0.0025",
          tokenBAmount: "3",
          minTick: -10,
          maxTick: 10,
          slippage: 0,
          caller,
          deadline,
        },
        fetchAllowance,
      );

      const { approveMessages, txMessages, resetMessages } = splitMessagesByApproveReset(messages, 2);

      expect(approveMessages).toHaveLength(2);
      expect(approveMessages).toEqual(
        expect.arrayContaining([
          {
            caller,
            send: "",
            pkg_path: "wugnot",
            func: "Approve",
            args: ["pool_address", "2500"],
            gasFee: undefined,
          },
          {
            caller,
            send: "",
            pkg_path: "tokenB_path",
            func: "Approve",
            args: ["pool_address", "3000000"],
            gasFee: undefined,
          },
        ]),
      );

      expect(txMessages).toEqual([
        {
          caller,
          send: "2500ugnot",
          pkg_path: "wugnot",
          func: "Deposit",
          args: null,
          gasFee: undefined,
        },
        {
          caller,
          send: "",
          pkg_path: "position_path",
          func: "Reposition",
          args: ["lp1", "-10", "10", "2500", "3000000", "2500", "3000000", deadline],
          gasFee: undefined,
        },
      ]);
      expectResetMessages(resetMessages, approveMessages);
    });
  });

  describe("makeRemoveLiquidityMessagesWithApproves", () => {
    it("creates DecreaseLiquidity tx for each lpTokenId without token approve messages", async () => {
      const caller = "caller";
      const deadline = "deadline";
      const lpTokenIds = ["lp1", "lp2"];

      const positionLiquidities = {
        lp1: new BigNumber(123),
        lp2: new BigNumber(456),
      };

      const tokenPaths = ["ugnot", "tokenB_path"];

      const fetchAllowance = jest.fn(async () => 0);
      const messages = await makeRemoveLiquidityMessagesWithApproves(
        {
          lpTokenIds,
          positionLiquidities,
          tokenPaths,
          caller,
          deadline,
        },
        fetchAllowance,
      );

      const { approveMessages, txMessages, resetMessages } = splitMessagesByApproveReset(messages, 0, 0);

      expect(approveMessages).toHaveLength(0);

      expect(txMessages).toEqual([
        {
          caller,
          send: "",
          pkg_path: "position_path",
          func: "DecreaseLiquidity",
          args: ["lp1", "123", "0", "0", deadline],
          gasFee: undefined,
        },
        {
          caller,
          send: "",
          pkg_path: "position_path",
          func: "DecreaseLiquidity",
          args: ["lp2", "456", "0", "0", deadline],
          gasFee: undefined,
        },
      ]);
      expect(resetMessages).toHaveLength(0);
      expect(fetchAllowance).not.toHaveBeenCalled();
    });
  });
});
