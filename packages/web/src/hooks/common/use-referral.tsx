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

  const [referralAddress, setReferralAddress] = React.useState<string>("");
  const referralAddressRef = React.useRef(referralAddress);

  React.useEffect(() => {
    referralAddressRef.current = referralAddress;
  }, [account?.address, referralAddress]);

  const urlReferralAddress = router.getReferrerParameter();
  const [storedReferralAddress, setStoredReferralAddress] = React.useState<string | null>(null);
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
      const storedData = sessionStorage.getItem(`${GNOSWAP_REFERRAL_CODE}_${account?.address}`);
      if (!storedData) return null;

      const parsed: StoredReferrerInfo = JSON.parse(storedData);
      return parsed;
    } catch {
      return null;
    }
  }, [account?.address]);

  const saveToSessionStorage = (referrerAddress: string) => {
    if (!account?.address) return;

    const data: StoredReferrerInfo = {
      referrerAddress,
      updatedAt: Date.now(),
    };

    sessionStorage.setItem(`${GNOSWAP_REFERRAL_CODE}_${account.address}`, JSON.stringify(data));
    setStoredReferralAddress(referrerAddress);
  };

  /**
   * Functions to store referrer addresses in session storage
   */
  const saveReferrerAddress = React.useCallback(
    (referrerAddress: string): SaveReferrerResult => {
      if (!account?.address) return { success: false, error: "NO_ACCOUNT" };

      const trimmedAddress = referrerAddress.trim();
      const isNonEmptyAddress = trimmedAddress !== "";

      if (isNonEmptyAddress && !isValidAddress(trimmedAddress)) {
        return { success: false, error: "INVALID_ADDRESS" };
      }

      if (isNonEmptyAddress && trimmedAddress === account.address) {
        return { success: false, error: "SELF_REFERRAL" };
      }

      saveToSessionStorage(trimmedAddress);

      return { success: true };
    },
    [account?.address],
  );

  // Handling URL parameters and session storage priorities
  React.useEffect(() => {
    // Rank 1: URL parameters
    const hasUrlReferralAddress = urlReferralAddress != null;
    if (hasUrlReferralAddress && isValidAddress(urlReferralAddress)) {
      setReferralAddress(urlReferralAddress);
      return;
    }

    const storedInfo = getStoredReferrerInfo();
    const storedAddress = storedInfo?.referrerAddress ?? null;

    setStoredReferralAddress(storedAddress);

    // Rank 2: Session Storage
    const hasStoredReferralAddress = storedAddress != null;
    if (hasStoredReferralAddress) {
      if (storedAddress === "" || isValidAddress(storedAddress)) {
        setReferralAddress(storedAddress);
        return;
      }
    }

    // Rank 3: API Resopnse(by leaderboard)
    if (!hasUrlReferralAddress && !hasStoredReferralAddress) {
      if (apiReferrerAddress && isValidAddress(apiReferrerAddress) && apiReferrerAddress !== account?.address) {
        setReferralAddress(apiReferrerAddress);

        if (account?.address) {
          saveToSessionStorage(apiReferrerAddress);
        }
      }
    }
  }, [urlReferralAddress, storedReferralAddress, apiReferrerAddress, saveToSessionStorage, account?.address]);

  return {
    referralAddress,
    storedReferralAddress,
    saveReferrerAddress,
    generateReferralLink,
    getCurrentReferralAddress: () => referralAddressRef.current,
  };
};
