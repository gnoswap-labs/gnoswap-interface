import React, { useEffect, useState } from "react";
import {
	AccountRepositoryInstance,
	AccountRepositoryMock,
} from "@/repositories/account";
import { LiquidityRepositoryMock } from "@/repositories/liquidity";
import { PoolRepositoryMock } from "@/repositories/pool";
import { StakingRepositoryMock } from "@/repositories/staking";
import { SwapRepositoryMock } from "@/repositories/swap";
import { TokenRepositoryMock } from "@/repositories/token";
import { AccountService } from "@/services/account/account-service";
// import { GnoClient, GnoClientApi } from "@gnoswap-labs/gno-client";
import { NetworkClient } from "../clients/network-client";
import { AxiosClient } from "../clients/network-client/axios-client";
import { WalletClient } from "../clients/wallet-client";
import { AdenaClient } from "../clients/wallet-client/adena-client";
import { GnoswapContext } from "./context";
import { StorageClient, WebStorageClient } from "../clients/storage-client";
import { PoolService } from "@/services/pool/pool-service";
import { LiquidityService } from "@/services/liquidity/liquidity-service";
import { StakingService } from "@/services/staking/staking-service";
import { TokenService } from "@/services/token/token-service";
import { SwapService } from "@/services/swap/swap-service";
import { MockStorageClient } from "../clients/storage-client/mock-storage-client";

interface Props {
	children: React.ReactNode;
}

export const GnoswapProvider = ({ children }: Props) => {
	const walletClient: WalletClient = AdenaClient.createAdenaClient();
	const networkClient: NetworkClient = AxiosClient.createAxiosClient();
	const localStorageClient: StorageClient =
		WebStorageClient.createLocalStorageClient();
	const sessionStorageClient: StorageClient =
		WebStorageClient.createSessionStorageClient();
	const mockLocalStorageClient: StorageClient =
		MockStorageClient.createLocalStorageClient(); 
	// const gnoClient: GnoClientApi = GnoClient.createNetworkByType(
	// 	{
	// 		chainId: "test3",
	// 		chainName: "Testnet 3",
	// 		rpcUrl: "https://rpc.test3.gno.land",
	// 		apiUrl: "",
	// 		linkUrl: "",
	// 	},
	// 	"TEST3",
	// );
	const accountRepository = new AccountRepositoryInstance(
		walletClient,
		localStorageClient,
	);
	const liquidityRepository = new LiquidityRepositoryMock();
	const poolRepository = new PoolRepositoryMock();
	const stakingRepository = new StakingRepositoryMock();
	const swapRepository = new SwapRepositoryMock();
	const tokenRepository = new TokenRepositoryMock(mockLocalStorageClient);

	const accountService = new AccountService(accountRepository);
	const tokenService = new TokenService(tokenRepository);
	const poolService = new PoolService(poolRepository);
	const liquidityService = new LiquidityService(liquidityRepository);
	const stakingService = new StakingService(stakingRepository);
	const swapService = new SwapService(swapRepository);

	return (
		<GnoswapContext.Provider
			value={{
				accountService,
				tokenService,
				poolService,
				liquidityService,
				stakingService,
				swapService,
				accountRepository,
				liquidityRepository,
				poolRepository,
				stakingRepository,
				swapRepository,
				tokenRepository,
			}}
		>
			{children}
		</GnoswapContext.Provider>
	);
};
