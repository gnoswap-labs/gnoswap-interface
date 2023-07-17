import { atom } from "jotai";
import { AccountRepository } from "@repositories/account";
import { LiquidityRepository } from "@repositories/liquidity";
import { PoolRepository } from "@repositories/pool";
import { StakingRepository } from "@repositories/staking";
import { SwapRepository } from "@repositories/swap";
import { TokenRepository } from "@repositories/token";
import { WalletClient } from "@common/clients/wallet-client";
import { StorageClient } from "@common/clients/storage-client";
import { StorageKeyType } from "@common/values";
import { NetworkClient } from "@common/clients/network-client";

export const walletClient = atom<WalletClient | null>(null);

export const networkClient = atom<NetworkClient | null>(null);

export const localStorageClient = atom<StorageClient<StorageKeyType> | null>(
  null,
);

export const accountRepository = atom<AccountRepository | null>(null);

export const liquidityRepository = atom<LiquidityRepository | null>(null);

export const poolRepository = atom<PoolRepository | null>(null);

export const stakingRepository = atom<StakingRepository | null>(null);

export const swapRepository = atom<SwapRepository | null>(null);

export const tokenRepository = atom<TokenRepository | null>(null);
