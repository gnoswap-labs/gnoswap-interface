import { AccountRepository } from "@/repositories/account";
import { LiquidityRepository } from "@/repositories/liquidity";
import { PoolRepository } from "@/repositories/pool";
import { StakingRepository } from "@/repositories/staking";
import { SwapRepository } from "@/repositories/swap";
import { TokenRepository } from "@/repositories/token";
import { AccountService } from "@/services/account/account-service";
import { LiquidityService } from "@/services/liquidity/liquidity-service";
import { PoolService } from "@/services/pool/pool-service";
import { createContext } from "react";

export interface GnoswapContextProps {
	accountService: AccountService;
	poolService: PoolService;
	liquidityService: LiquidityService;
	accountRepository: AccountRepository;
	liquidityRepository: LiquidityRepository;
	poolRepository: PoolRepository;
	stakingRepository: StakingRepository;
	swapRepository: SwapRepository;
	tokenRepository: TokenRepository;
}

export const GnoswapContext = createContext<GnoswapContextProps | null>(null);
