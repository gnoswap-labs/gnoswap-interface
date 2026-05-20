import {
  makeDepositGNOTMessage,
  makeNFTApproveMessage,
  makeTransactionMessage,
  makeTransactionMessagesWithApproves,
  TokenApproveMessageInfo,
  TransactionMessage,
} from "@common/clients/wallet-client/transaction-messages";
import {
  PACKAGE_POOL_ADDRESS,
  PACKAGE_POSITION_PATH,
  PACKAGE_STAKER_ADDRESS,
  PACKAGE_STAKER_PATH,
} from "@constants/environment.constant";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { PositionModel } from "@models/position/position-model";
import { TokenModel } from "@models/token/token-model";
import { checkGnotPath, wrapNativeTokenPath } from "@utils/common";
import { calculateMaxTokenAmount, calculateMinTokenAmount } from "@utils/slippage-utils";
import { makeRawTokenAmount } from "@utils/token-utils";
import { getWrappedGNOTDepositAmount } from "@utils/transaction-utils";
import BigNumber from "bignumber.js";

enum TransactionMessageFunctionType {
  CollectFee = "CollectFee",
  CollectReward = "CollectReward",
  StakeToken = "StakeToken",
  UnStakeToken = "UnStakeToken",
  IncreaseLiquidity = "IncreaseLiquidity",
  DecreaseLiquidity = "DecreaseLiquidity",
  Reposition = "Reposition",
}

export function makeClaimMessageWithApproves(
  {
    position,
    caller,
  }: {
    position: PositionModel;
    caller: string;
  },
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const approveMessageInfos: TokenApproveMessageInfo[] = [];
  const messages: TransactionMessage[] = [];

  let hasFee = false;
  let hasStakingReward = false;
  position.rewards.forEach(reward => {
    if (reward.rewardToken.rewardType === "SWAP_FEE") {
      hasFee = true;
    } else {
      hasStakingReward = true;
    }
  });

  if (hasFee) {
    messages.push(
      makeTransactionMessage({
        send: "",
        func: TransactionMessageFunctionType.CollectFee,
        packagePath: PACKAGE_POSITION_PATH,
        args: [position.lpTokenId.toString()],
        caller,
      }),
    );
  }
  if (hasStakingReward) {
    messages.push(
      makeTransactionMessage({
        send: "",
        func: TransactionMessageFunctionType.CollectReward,
        packagePath: PACKAGE_STAKER_PATH,
        args: [position.lpTokenId.toString()],
        caller,
      }),
    );
  }

  return makeTransactionMessagesWithApproves(messages, approveMessageInfos, fetchAllowance);
}

export function makeClaimAllMessageWithApprovesByIds(
  {
    positionsWithSwapFee,
    positionsWithStakingReward,
    caller,
  }: {
    swapFeeTokenPaths: string[];
    hasGnotStakingReward: boolean;
    positionsWithSwapFee: string[];
    positionsWithStakingReward: string[];
    caller: string;
  },
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const approveMessageInfos: TokenApproveMessageInfo[] = [];

  const messages: TransactionMessage[] = [];

  positionsWithSwapFee.forEach(lpTokenId => {
    messages.push(
      makeTransactionMessage({
        send: "",
        func: TransactionMessageFunctionType.CollectFee,
        packagePath: PACKAGE_POSITION_PATH,
        args: [lpTokenId.toString()],
        caller,
      }),
    );
  });

  positionsWithStakingReward.forEach(lpTokenId => {
    messages.push(
      makeTransactionMessage({
        send: "",
        func: TransactionMessageFunctionType.CollectReward,
        packagePath: PACKAGE_STAKER_PATH,
        args: [lpTokenId.toString()],
        caller,
      }),
    );
  });

  return makeTransactionMessagesWithApproves(messages, approveMessageInfos, fetchAllowance);
}

export function makeClaimAllMessageWithApproves(
  {
    positions,
    caller,
  }: {
    positions: PositionModel[];
    caller: string;
  },
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const approveMessageInfos: TokenApproveMessageInfo[] = [];
  const messages: TransactionMessage[] = positions.flatMap(position => {
    let hasFee = false;
    let hasStakingReward = false;
    const collectMessages: TransactionMessage[] = [];

    position.rewards.forEach(reward => {
      if (reward.rewardToken.rewardType === "SWAP_FEE") {
        const claimableAmount = BigNumber(reward.claimableAmount).toNumber();
        if (claimableAmount <= 0) {
          return;
        }

        hasFee = true;
      } else {
        hasStakingReward = true;
      }
    });

    if (hasFee) {
      collectMessages.push(
        makeTransactionMessage({
          send: "",
          func: TransactionMessageFunctionType.CollectFee,
          packagePath: PACKAGE_POSITION_PATH,
          args: [position.lpTokenId.toString()],
          caller,
        }),
      );
    }
    if (hasStakingReward) {
      collectMessages.push(
        makeTransactionMessage({
          send: "",
          func: TransactionMessageFunctionType.CollectReward,
          packagePath: PACKAGE_STAKER_PATH,
          args: [position.lpTokenId.toString()],
          caller,
        }),
      );
    }

    return collectMessages;
  });

  return makeTransactionMessagesWithApproves(messages, approveMessageInfos, fetchAllowance);
}

export function makeStakePositionsMessagesWithApproves({
  lpTokenIds,
  caller,
  referrerAddress,
}: {
  lpTokenIds: string[];
  caller: string;
  referrerAddress: string | null;
}): TransactionMessage[] {
  const messages: TransactionMessage[] = lpTokenIds.flatMap(lpTokenId => [
    makeNFTApproveMessage(PACKAGE_STAKER_ADDRESS, lpTokenId, caller),
    makeTransactionMessage({
      send: "",
      func: TransactionMessageFunctionType.StakeToken,
      packagePath: PACKAGE_STAKER_PATH,
      args: [lpTokenId.toString(), referrerAddress || ""], // Referral address
      caller,
    }),
  ]);

  return messages;
}

export function makeUnStakePositionsMessagesWithApproves(
  {
    positions,
    caller,
  }: {
    positions: PoolPositionModel[];
    caller: string;
  },
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const approveMessageInfos: TokenApproveMessageInfo[] = [];

  const unstakeMessages = positions.map(position =>
    makeTransactionMessage({
      send: "",
      func: TransactionMessageFunctionType.UnStakeToken,
      packagePath: PACKAGE_STAKER_PATH,
      args: [position.lpTokenId.toString()],
      caller,
    }),
  );

  return makeTransactionMessagesWithApproves(unstakeMessages, approveMessageInfos, fetchAllowance);
}

export function makeIncreaseLiquidityMessagesWithApproves(
  {
    lpTokenId,
    tokenA,
    tokenB,
    tokenAAmount,
    tokenBAmount,
    caller,
    slippage,
    deadline = (Math.floor(Date.now() / 1000) + 60 * 5).toString(),
  }: {
    lpTokenId: string;
    tokenA: TokenModel;
    tokenB: TokenModel;
    tokenAAmount: number;
    tokenBAmount: number;
    caller: string;
    slippage: number;
    deadline?: string;
  },
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const tokenAWrappedPath = tokenA.wrappedPath || wrapNativeTokenPath(tokenA.path);
  const tokenBWrappedPath = tokenB.wrappedPath || wrapNativeTokenPath(tokenB.path);

  const tokenAAmountRaw = makeRawTokenAmount(tokenA, tokenAAmount) || "0";
  const tokenBAmountRaw = makeRawTokenAmount(tokenB, tokenBAmount) || "0";
  const tokenAAmountMaxRaw = calculateMaxTokenAmount(tokenAAmountRaw, slippage);
  const tokenBAmountMaxRaw = calculateMaxTokenAmount(tokenBAmountRaw, slippage);

  // Make Approve messages that can be managed by a Pool package of tokens.
  const approveMessageInfos: TokenApproveMessageInfo[] = [
    {
      tokenPath: tokenAWrappedPath,
      targetAddress: PACKAGE_POOL_ADDRESS,
      amount: tokenAAmountMaxRaw,
      caller,
    },
    {
      tokenPath: tokenBWrappedPath,
      targetAddress: PACKAGE_POOL_ADDRESS,
      amount: tokenBAmountMaxRaw,
      caller,
    },
  ];

  const messages: TransactionMessage[] = [];

  const depositAmount = getWrappedGNOTDepositAmount(tokenA.path, tokenB.path, tokenAAmountMaxRaw, tokenBAmountMaxRaw);
  if (BigNumber(depositAmount).isGreaterThan(0)) {
    const depositMessage = makeDepositGNOTMessage(depositAmount, caller);
    if (depositMessage) {
      messages.push(depositMessage);
    }
  }

  const increaseLiquidityMessage = makeTransactionMessage({
    send: "",
    func: TransactionMessageFunctionType.IncreaseLiquidity,
    packagePath: PACKAGE_POSITION_PATH,
    args: [
      lpTokenId, // LP Token ID
      tokenAAmountMaxRaw, // Maximum amount of tokenA to offer
      tokenBAmountMaxRaw, // Maximum amount of tokenB to offer
      calculateMinTokenAmount(tokenAAmountRaw, slippage), // Minimum amount of tokenA to provide
      calculateMinTokenAmount(tokenBAmountRaw, slippage), // Minimum amount of tokenB to provide
      deadline, // Deadline UTC time
    ],
    caller,
  });
  messages.push(increaseLiquidityMessage);

  return makeTransactionMessagesWithApproves(messages, approveMessageInfos, fetchAllowance);
}

export function makeDecreaseLiquidityMessagesWithApproves(
  {
    lpTokenId,
    calculatedLiquidity,
    tokenAAmount,
    tokenBAmount,
    slippage,
    caller,
    deadline = (Math.floor(Date.now() / 1000) + 60 * 5).toString(),
  }: {
    lpTokenId: string;
    calculatedLiquidity: string;
    tokenA: TokenModel;
    tokenB: TokenModel;
    tokenAAmount: number;
    tokenBAmount: number;
    slippage: number;
    deadline?: string;
    caller: string;
  },
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const approveMessageInfos: TokenApproveMessageInfo[] = [];

  const slippageRatio = (100 - slippage) / 100;

  const decreaseLiquidityMessage = makeTransactionMessage({
    send: "",
    func: TransactionMessageFunctionType.DecreaseLiquidity,
    packagePath: PACKAGE_POSITION_PATH,
    args: [
      lpTokenId, // LP Token ID
      BigNumber(calculatedLiquidity).toFixed(0), // liquidity to decrease value
      BigNumber(tokenAAmount).multipliedBy(slippageRatio).toFixed(0), // Minimum quantity of tokenA to decrease liquidity
      BigNumber(tokenBAmount).multipliedBy(slippageRatio).toFixed(0), // Minimum quantity of tokenB to decrease liquidity
      deadline, // Deadline UTC time
    ],
    caller,
  });

  return makeTransactionMessagesWithApproves([decreaseLiquidityMessage], approveMessageInfos, fetchAllowance);
}

export function makeRepositionLiquidityMessagesWithApproves(
  {
    lpTokenId,
    tokenA,
    tokenB,
    tokenAAmount,
    tokenBAmount,
    minTick,
    maxTick,
    slippage,
    caller,
    deadline = (Math.floor(Date.now() / 1000) + 60 * 5).toString(),
  }: {
    lpTokenId: string;
    tokenA: TokenModel;
    tokenB: TokenModel;
    tokenAAmount: string;
    tokenBAmount: string;
    minTick: number;
    maxTick: number;
    slippage: number;
    caller: string;
    deadline?: string;
    withStaking?: boolean;
  },
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const tokenAWrappedPath = tokenA.wrappedPath || checkGnotPath(tokenA.path);
  const tokenBWrappedPath = tokenB.wrappedPath || checkGnotPath(tokenB.path);

  const tokenAAmountRaw = makeRawTokenAmount(tokenA, tokenAAmount) || "0";
  const tokenBAmountRaw = makeRawTokenAmount(tokenB, tokenBAmount) || "0";
  const tokenAAmountMaxRaw = calculateMaxTokenAmount(tokenAAmountRaw, slippage);
  const tokenBAmountMaxRaw = calculateMaxTokenAmount(tokenBAmountRaw, slippage);

  const minTokenAAmount = calculateMinTokenAmount(tokenAAmountRaw, slippage);
  const minTokenBAmount = calculateMinTokenAmount(tokenBAmountRaw, slippage);

  // Make Approve messages that can be managed by a Pool package of tokens.
  const approveMessageInfos: TokenApproveMessageInfo[] = [
    {
      tokenPath: tokenAWrappedPath,
      targetAddress: PACKAGE_POOL_ADDRESS,
      amount: tokenAAmountMaxRaw,
      caller,
    },
    {
      tokenPath: tokenBWrappedPath,
      targetAddress: PACKAGE_POOL_ADDRESS,
      amount: tokenBAmountMaxRaw,
      caller,
    },
  ];

  const messages: TransactionMessage[] = [];
  const depositAmount = getWrappedGNOTDepositAmount(tokenA.path, tokenB.path, tokenAAmountMaxRaw, tokenBAmountMaxRaw);
  if (BigNumber(depositAmount).isGreaterThan(0)) {
    const depositMessage = makeDepositGNOTMessage(depositAmount, caller);
    if (depositMessage) {
      messages.push(depositMessage);
    }
  }

  const repositionLiquidityMessage = makeTransactionMessage({
    send: "",
    func: TransactionMessageFunctionType.Reposition,
    packagePath: PACKAGE_POSITION_PATH,
    args: [
      lpTokenId, // LP Token ID
      `${minTick}`, // position's minimal tick
      `${maxTick}`, // position's maximal tick
      `${tokenAAmountMaxRaw}`, // Maximum amount of tokenA to offer
      `${tokenBAmountMaxRaw}`, // Maximum amount of tokenB to offer
      minTokenAAmount, // Minimum amount of tokenA to provide
      minTokenBAmount, // Minimum amount of tokenB to provide
      deadline, // Deadline UTC time
    ],
    caller,
  });
  messages.push(repositionLiquidityMessage);

  return makeTransactionMessagesWithApproves(messages, approveMessageInfos, fetchAllowance);
}

export function makeRemoveLiquidityMessagesWithApproves(
  {
    lpTokenIds,
    positionLiquidities,
    caller,
    deadline = (Math.floor(Date.now() / 1000) + 60 * 5).toString(),
  }: {
    lpTokenIds: string[];
    positionLiquidities: Record<string, BigNumber>;
    tokenPaths: string[];
    caller: string;
    deadline?: string;
  },
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const approveMessageInfos: TokenApproveMessageInfo[] = [];

  const removeLiquidityMessages = lpTokenIds.map(lpTokenId => {
    const positionLiquidity = positionLiquidities[lpTokenId] || new BigNumber(0);
    return makeTransactionMessage({
      send: "",
      func: TransactionMessageFunctionType.DecreaseLiquidity,
      packagePath: PACKAGE_POSITION_PATH,
      args: [
        lpTokenId, // LP Token ID
        positionLiquidity.toString(), // Liquidity amount to remove (100%)
        "0", // Minimum quantity of tokenA to decrease liquidity
        "0", // Minimum quantity of tokenB to decrease liquidity
        deadline, // Deadline UTC time
      ],
      caller,
    });
  });

  return makeTransactionMessagesWithApproves(removeLiquidityMessages, approveMessageInfos, fetchAllowance);
}
