import { atom } from "jotai";
import { AccountHistoryModel } from "@models/account/account-history-model";

export const notifications = atom<AccountHistoryModel | null>(null);
