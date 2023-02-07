import React, { useEffect, useState } from "react";
import {
	AccountRepositoryInstance,
	MockAccountRepository,
} from "@/repositories/account";
import { MockLiquidityRepository } from "@/repositories/liquidity";
import { MockPoolRepository } from "@/repositories/pool";
import { MockStakingRepository } from "@/repositories/staking";
import { MockSwapRepository } from "@/repositories/swap";
import { MockTokenRepository } from "@/repositories/token";
import { AccountService } from "@/services/account/account-service";
import { GnoClient, GnoClientApi } from "gno-client";
import { NetworkClient } from "../clients/network-client";
import { AxiosClient } from "../clients/network-client/axios-client";
import { WalletClient } from "../clients/wallet-client";
import { AdenaClient } from "../clients/wallet-client/adena-client";
import { GnoswapContext } from "./context";
import { StorageClient, WebStorageClient } from "../clients/storage-client";
import { PoolService } from "@/services/pool/pool-service";
import { LiquidityService } from "@/services/liquidity/liquidity-service";
import { StakingService } from "@/services/staking/staking-service";

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
	const gnoClient: GnoClientApi = GnoClient.createNetworkByType(
		{
			chainId: "test3",
			chainName: "Testnet 3",
			rpcUrl: "https://rpc.test3.gno.land",
			apiUrl: "",
			linkUrl: "",
		},
		"TEST3",
	);
	const accountRepository = new AccountRepositoryInstance(walletClient);
	const liquidityRepository = new MockLiquidityRepository();
	const poolRepository = new MockPoolRepository();
	const stakingRepository = new MockStakingRepository();
	const swapRepository = new MockSwapRepository();
	const tokenRepository = new MockTokenRepository();

	const accountService = new AccountService(accountRepository);
	const poolService = new PoolService(poolRepository);
	const liquidityService = new LiquidityService(liquidityRepository);
	const stakingService = new StakingService(stakingRepository);

	return (
		<GnoswapContext.Provider
			value={{
				accountService,
				poolService,
				liquidityService,
				stakingService,
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
