import { atom } from "jotai";
import { AccountHistoryModel } from "@models/account/account-history-model";

export const connected = atom<boolean>(false);

export const address = atom<string | null>(null);

export const notifications = atom<AccountHistoryModel | null>(null);
