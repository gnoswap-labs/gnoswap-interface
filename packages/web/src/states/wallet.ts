import { WalletClient } from "@common/clients/wallet-client";
import { AccountInfo } from "@common/clients/wallet-client/protocols";
import { atom } from "jotai";

export const client = atom<WalletClient | null>(null);

export const account = atom<AccountInfo | null>(null);
