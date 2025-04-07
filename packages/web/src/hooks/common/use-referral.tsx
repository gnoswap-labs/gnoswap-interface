import React from "react";

import useCustomRouter from "./use-custom-router";
import { GNOSWAP_REFERRAL_CODE } from "@states/common";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { isValidAddress } from "@utils/validation-utils";
import { QUERY_PARAMETER } from "@constants/page.constant";
import { useGetLeaderboardByAddress } from "@query/leaderboard";

export interface StoredReferrerInfo {
  referrerAddress: string;
  updatedAt: number;
}

export interface SaveReferrerResult {
  success: boolean;
  error?: "INVALID_ADDRESS" | "SELF_REFERRAL" | "NO_ACCOUNT";
}

export const useReferral = () => {
  const router = useCustomRouter();
  const { account } = useWallet();
  const { data: leaderboardMyInfo } = useGetLeaderboardByAddress(account?.address || "");

  const [referralCode, setReferralCode] = React.useState<string>("");

  const urlReferralCode = router.getReferrerParameter();
  const [storedReferralCode, setStoredReferralCode] = React.useState<string>("");
  const apiReferrerAddress = leaderboardMyInfo?.referrerAddress || "";

  const generateReferralLink = React.useCallback((): string => {
    if (typeof window === "undefined" || !account?.address) return "";

    const url = new URL(window.location.origin);
    url.searchParams.set(QUERY_PARAMETER.REFERRER, account.address);
    return url.toString();
  }, [account?.address]);

  /**
   * Get referrer information from session storage (internal function)
   */
  const getStoredReferrerInfo = React.useCallback((): StoredReferrerInfo | null => {
    try {
      const storedData = sessionStorage.getItem(GNOSWAP_REFERRAL_CODE);
      if (!storedData) return null;

      const parsed: StoredReferrerInfo = JSON.parse(storedData);
      return parsed;
    } catch {
      return null;
    }
  }, []);

  /**
   * Functions to store referrer addresses in session storage
   */
  const saveReferrerAddress = React.useCallback(
    (referrerAddress: string): SaveReferrerResult => {
      if (!account?.address) return { success: false, error: "NO_ACCOUNT" };

      const trimmedAddress = referrerAddress.trim();
      if (trimmedAddress && !isValidAddress(trimmedAddress)) {
        return { success: false, error: "INVALID_ADDRESS" };
      }

      if (trimmedAddress === account.address) {
        return { success: false, error: "SELF_REFERRAL" };
      }

      const data: StoredReferrerInfo = {
        referrerAddress: trimmedAddress,
        updatedAt: Date.now(),
      };

      sessionStorage.setItem(GNOSWAP_REFERRAL_CODE, JSON.stringify(data));
      setStoredReferralCode(trimmedAddress);

      return { success: true };
    },
    [account?.address],
  );

  // Loading referrer information from session storage when mounting components
  React.useEffect(() => {
    if (!account?.address) return;

    const storedInfo = getStoredReferrerInfo();
    if (storedInfo?.referrerAddress) {
      setStoredReferralCode(storedInfo.referrerAddress);
    }
  }, [account?.address, getStoredReferrerInfo]);

  // Handling URL parameters and session storage priorities
  React.useEffect(() => {
    // Rank 1: URL parameters
    if (urlReferralCode) {
      setReferralCode(urlReferralCode);
      return;
    }

    // Rank 2: Session Storage
    if (storedReferralCode) {
      setReferralCode(storedReferralCode);
    }

    // Rank 3: API Resopnse(by leaderboard)
    if (apiReferrerAddress) {
      setReferralCode(apiReferrerAddress);

      if (account?.address) {
        const data: StoredReferrerInfo = {
          referrerAddress: apiReferrerAddress,
          updatedAt: Date.now(),
        };
        sessionStorage.setItem(GNOSWAP_REFERRAL_CODE, JSON.stringify(data));
        setStoredReferralCode(apiReferrerAddress);
      }
    }
  }, [urlReferralCode, storedReferralCode, apiReferrerAddress, account?.address]);

  return {
    referralCode,
    storedReferralCode,
    saveReferrerAddress,
    generateReferralLink,
  };
};
