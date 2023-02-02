import { AccountRepositoryMock } from "@/repositories/account";
import { LiquidityRepositoryMock } from "@/repositories/liquidity";
import { PoolRepositoryMock } from "@/repositories/pool";
import { StakingRepositoryMock } from "@/repositories/staking";
import { SwapRepositoryMock } from "@/repositories/swap";
import { TokenRepositoryMock } from "@/repositories/token";
import React from "react";
import { GnoswapContext } from "./context";

interface Props {
	children: React.ReactNode;
}

export const GnoswapProvider = ({ children }: Props) => {
	const accountRepository = new AccountRepositoryMock();
	const liquidityRepository = new LiquidityRepositoryMock();
	const poolRepository = new PoolRepositoryMock();
	const stakingRepository = new StakingRepositoryMock();
	const swapRepository = new SwapRepositoryMock();
	const tokenRepository = new TokenRepositoryMock();

	return (
		<GnoswapContext.Provider
			value={{
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
