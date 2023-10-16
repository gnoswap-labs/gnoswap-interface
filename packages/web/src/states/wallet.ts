import { WalletClient } from "@common/clients/wallet-client";
import { AdenaClient } from "@common/clients/wallet-client/adena";
import { AccountModel } from "@models/account/account-model";
import { atom } from "jotai";

export const client = atom<WalletClient>(new AdenaClient());

export const account = atom<AccountModel | null>(null);
