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
import { AccountService } from "@/service/account-service";
import { GnoClient, GnoClientApi } from "gno-client";
import { NetworkClient } from "../clients/network-client";
import { AxiosClient } from "../clients/network-client/axios-client";
import { WalletClient } from "../clients/wallet-client";
import { AdenaClient } from "../clients/wallet-client/adena-client";
import { GnoswapContext } from "./context";

interface Props {
	children: React.ReactNode;
}

export const GnoswapProvider = ({ children }: Props) => {
	const walletClient: WalletClient = AdenaClient.createAdenaClient();
	const networkClient: NetworkClient = AxiosClient.createAxiosClient();
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
	const liquidityRepository = new LiquidityRepositoryMock();
	const poolRepository = new PoolRepositoryMock();
	const stakingRepository = new StakingRepositoryMock();
	const swapRepository = new SwapRepositoryMock();
	const tokenRepository = new TokenRepositoryMock();

	const accountService = new AccountService(accountRepository);

	return (
		<GnoswapContext.Provider
			value={{
				accountService,
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
