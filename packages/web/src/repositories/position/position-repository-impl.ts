import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import { SendTransactionSuccessResponse } from "@common/clients/wallet-client/protocols";
import { CommonError } from "@common/errors";
import {
  DEFAULT_GAS_FEE,
  DEFAULT_GAS_WANTED,
  DEFAULT_TRANSACTION_DEADLINE,
} from "@common/values";
import { GnoProvider } from "@gnolang/gno-js-client";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { PositionModel } from "@models/position/position-model";
import { MAX_INT256 } from "@utils/math.utils";
import { PositionRepository } from "./position-repository";
import { ClaimAllRequest } from "./request/claim-all-request";
import { RemoveLiquidityReqeust } from "./request/remove-liquidity-request";
import { StakePositionsRequest } from "./request/stake-positions-request";
import { UnstakePositionsRequest } from "./request/unstake-positions-request";
import { PositionListResponse } from "./response";

const STAKER_PATH = process.env.NEXT_PUBLIC_PACKAGE_STAKER_PATH || "";
const STAKER_ADDRESS = process.env.NEXT_PUBLIC_PACKAGE_STAKER_ADDRESS || "";
const POSITION_PATH = process.env.NEXT_PUBLIC_PACKAGE_POSITION_PATH || "";
const NFT_PATH = process.env.NEXT_PUBLIC_PACKAGE_NFT_PATH || "";

export class PositionRepositoryImpl implements PositionRepository {
  private networkClient: NetworkClient;
  private rpcProvider: GnoProvider | null;
  private walletClient: WalletClient | null;

  constructor(
    networkClient: NetworkClient,
    rpcProvider: GnoProvider | null,
    walletClient: WalletClient | null,
  ) {
    this.networkClient = networkClient;
    this.rpcProvider = rpcProvider;
    this.walletClient = walletClient;
  }

  getPositionsByAddress = async (address: string): Promise<PositionModel[]> => {
    const response = await this.networkClient.get<PositionListResponse>({
      url: "/positions/" + address,
    });
    return PositionMapper.fromList(response.data);
  };

  claimAll = async (request: ClaimAllRequest): Promise<string | null> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const { lpTokenIds, receipient } = request;
    const messages = lpTokenIds.flatMap(lpTokenId => {
      const messages = [];
      messages.push(
        PositionRepositoryImpl.makeZeroDecreaseLiquidityMessage(
          lpTokenId,
          receipient,
        ),
      );
      messages.push(
        PositionRepositoryImpl.makeCollectMessage(lpTokenId, receipient),
      );
      console.log("message", messages);
      return messages;
    });
    console.log("?lpTokenIds", lpTokenIds);

    // TODO: Need to check if a contract error occurred
    // messages.push(PositionRepositoryImpl.makeCollectRewardMessage(receipient));

    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      gasWanted: DEFAULT_GAS_WANTED,
    });
    const hash = (result.data as SendTransactionSuccessResponse)?.hash || null;
    if (!hash) {
      throw new Error(`${result}`);
    }
    return hash;
  };

  stakePositions = async (
    request: StakePositionsRequest,
  ): Promise<string | null> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const { lpTokenIds, caller } = request;
    const messages = lpTokenIds.flatMap(lpTokenId => [
      PositionRepositoryImpl.makeApporveStakeTokenMessage(lpTokenId, caller),
      PositionRepositoryImpl.makeStakeMessage(lpTokenId, caller),
    ]);
    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      gasWanted: DEFAULT_GAS_WANTED,
    });
    const hash = (result.data as SendTransactionSuccessResponse)?.hash || null;
    if (!hash) {
      throw new Error(`${result}`);
    }
    return hash;
  };

  unstakePositions = async (
    request: UnstakePositionsRequest,
  ): Promise<string | null> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const { lpTokenIds, caller } = request;
    const messages = lpTokenIds.map(lpTokenId =>
      PositionRepositoryImpl.makeUnstakeMessage(lpTokenId, caller),
    );
    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      gasWanted: DEFAULT_GAS_WANTED,
    });
    const hash = (result.data as SendTransactionSuccessResponse)?.hash || null;
    if (!hash) {
      throw new Error(`${result}`);
    }
    return hash;
  };

  removeLiquidity = async (
    request: RemoveLiquidityReqeust,
  ): Promise<string | null> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const { lpTokenIds, caller } = request;
    const messages = lpTokenIds.map(lpTokenId =>
      PositionRepositoryImpl.makeDecreaseLiquidityMessage(
        lpTokenId,
        MAX_INT256.toString(),
        DEFAULT_TRANSACTION_DEADLINE,
        caller,
      ),
    );
    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      gasWanted: DEFAULT_GAS_WANTED,
    });
    const hash = (result.data as SendTransactionSuccessResponse)?.hash || null;
    if (!hash) {
      throw new Error(`${result}`);
    }
    return hash;
  };

  private static makeCollectMessage(lpTokenId: string, receipient: string) {
    return {
      caller: receipient,
      send: "",
      pkg_path: POSITION_PATH,
      func: "Collect",
      args: [
        lpTokenId,
        receipient,
        MAX_INT256.toString(),
        MAX_INT256.toString(),
      ],
    };
  }

  private static makeCollectRewardMessage(caller: string) {
    return {
      caller,
      send: "",
      pkg_path: STAKER_PATH,
      func: "CollectReward",
      args: [],
    };
  }
  private static makeApporveStakeTokenMessage(
    lpTokenId: string,
    caller: string,
  ) {
    return {
      caller,
      send: "",
      pkg_path: NFT_PATH,
      func: "Approve",
      args: [STAKER_ADDRESS, lpTokenId],
    };
  }

  private static makeStakeMessage(lpTokenId: string, caller: string) {
    return {
      caller,
      send: "",
      pkg_path: STAKER_PATH,
      func: "StakeToken",
      args: [lpTokenId],
    };
  }

  private static makeUnstakeMessage(lpTokenId: string, caller: string) {
    return {
      caller,
      send: "",
      pkg_path: STAKER_PATH,
      func: "UnstakeToken",
      args: [lpTokenId],
    };
  }

  private static makeDecreaseLiquidityMessage(
    lpTokenId: string,
    liquidity: string,
    deadeline: string,
    caller: string,
  ) {
    return {
      caller,
      send: "",
      pkg_path: POSITION_PATH,
      func: "DecreaseLiquidity",
      args: [lpTokenId, liquidity, deadeline],
    };
  }

  private static makeZeroDecreaseLiquidityMessage(
    lpTokenId: string,
    caller: string,
  ) {
    return this.makeDecreaseLiquidityMessage(
      lpTokenId,
      "0",
      DEFAULT_TRANSACTION_DEADLINE,
      caller,
    );
  }
}
