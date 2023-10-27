import { WalletClient } from "@common/clients/wallet-client";
import { AccountModel } from "@models/account/account-model";
import { atom } from "jotai";

export const client = atom<WalletClient | null>(null);

export const account = atom<AccountModel | null>(null);
