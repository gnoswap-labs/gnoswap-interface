import { AccountRepositoryMock } from "@/repositories/account";
import { LiquidityRepositoryMock } from "@/repositories/liquidity";
import { PoolRepositoryMock } from "@/repositories/pool";
import { StakingRepositoryMock } from "@/repositories/staking";
import { SwapRepositoryMock } from "@/repositories/swap";
import { TokenRepositoryMock } from "@/repositories/token";
import { AccountService } from "@/service/account-service";
import { GnoClient } from "gno-client";
import React from "react";
import { AxiosClient } from "../clients/network-client/axios-client";
import { GnoswapContext } from "./context";

interface Props {
	children: React.ReactNode;
}

export const GnoswapProvider = ({ children }: Props) => {
	const networkClient = AxiosClient.createAxiosClient();
	const gnoClient = GnoClient.createNetworkByType(
		{
			chainId: "",
			chainName: "",
			rpcUrl: "",
		},
		"TEST3",
	);
	const accountRepository = new AccountRepositoryMock();
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
