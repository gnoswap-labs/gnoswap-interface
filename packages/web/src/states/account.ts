import { AccountHistoryModel } from "@/models/account/account-history-model";
import { atom } from "recoil";

export const connected = atom<boolean>({
  key: "account/connected",
  default: false,
});

export const address = atom<string | null>({
  key: "account/address",
  default: "",
});

export const notifications = atom<AccountHistoryModel | null>({
  key: "account/notifications",
  default: null,
});
