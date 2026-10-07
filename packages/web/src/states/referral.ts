import { atom } from "jotai";

import { StoredReferrerInfo } from "@utils/referral-utils";

export const referralAddress = atom<string>("");

export const storedReferrerInfo = atom<StoredReferrerInfo | null>(null);
