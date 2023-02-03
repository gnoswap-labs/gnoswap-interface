import { AccountRepository } from "@/repositories/account";
import { LiquidityRepository } from "@/repositories/liquidity";
import { PoolRepository } from "@/repositories/pool";
import { StakingRepository } from "@/repositories/staking";
import { SwapRepository } from "@/repositories/swap";
import { TokenRepository } from "@/repositories/token";
import { AccountService } from "@/services/account/account-info-service";
import { createContext } from "react";

export interface GnoswapContextProps {
	accountService: AccountService;
	accountRepository: AccountRepository;
	liquidityRepository: LiquidityRepository;
	poolRepository: PoolRepository;
	stakingRepository: StakingRepository;
	swapRepository: SwapRepository;
	tokenRepository: TokenRepository;
}

export const GnoswapContext = createContext<GnoswapContextProps | null>(null);
