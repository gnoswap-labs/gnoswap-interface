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
  const { data: leaderboardMyInfo, refetch: refetchLeaderboardMyInfo } = useGetLeaderboardByAddress(
    account?.address || "",
  );

  const [referralAddress, setReferralAddress] = React.useState<string>("");
  const referralAddressRef = React.useRef(referralAddress);

  React.useEffect(() => {
    referralAddressRef.current = referralAddress;
  }, [account?.address, referralAddress]);

  const urlReferralAddress = router.getReferrerParameter();
  const [storedReferralAddress, setStoredReferralAddress] = React.useState<string | null>(null);
  const apiReferrerAddress = leaderboardMyInfo?.referrerAddress || "";

  const referralEarnedPoints = React.useMemo(() => {
    if (!leaderboardMyInfo?.referralPoint) return 0;
    return parseInt(leaderboardMyInfo.referralPoint) || 0;
  }, [leaderboardMyInfo?.referralPoint]);

  const generateReferralLink = React.useCallback((): string => {
    if (typeof window === "undefined" || !account?.address) return "";

    const url = new URL(window.location.origin);
    url.searchParams.set(QUERY_PARAMETER.REFERRER, account.address);
    return url.toString();
  }, [account?.address]);

  /**
   * Get referrer information from ClientStorage (internal function)
   */
  const getStoredReferrerInfo = React.useCallback((): StoredReferrerInfo | null => {
    try {
      const storedData = localStorage.getItem(`${GNOSWAP_REFERRAL_CODE}_${account?.address}`);
      if (!storedData) return null;

      const parsed: StoredReferrerInfo = JSON.parse(storedData);
      return parsed;
    } catch {
      return null;
    }
  }, [account?.address]);

  const saveToLocalStorage = (referrerAddress: string) => {
    if (!account?.address) return;

    const data: StoredReferrerInfo = {
      referrerAddress,
      updatedAt: Date.now(),
    };

    localStorage.setItem(`${GNOSWAP_REFERRAL_CODE}_${account.address}`, JSON.stringify(data));
    setStoredReferralAddress(referrerAddress);
  };

  /**
   * Functions to store referrer addresses in ClientStorage
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

      removeReferrerFromUrl();
      saveToLocalStorage(trimmedAddress);

      return { success: true };
    },
    [account?.address],
  );

  /**
   * REFERRER query parameter stripping function
   */
  const removeReferrerFromUrl = React.useCallback(() => {
    const referrer = router.getReferrerParameter();
    if (!referrer) return;

    const { pathname, query } = router;

    const newQuery = { ...query };
    delete newQuery[QUERY_PARAMETER.REFERRER];

    const queryString = Object.entries(newQuery)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join("&");

    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, undefined, { shallow: true });
  }, [router]);

  /**
   * Functions to remove referrer addresses from ClientStorage
   */
  const removeReferrerFromLocalStorage = React.useCallback(() => {
    if (!account?.address) return;
    localStorage.removeItem(`${GNOSWAP_REFERRAL_CODE}_${account.address}`);
    setStoredReferralAddress(null);
  }, [account?.address]);

  const refreshReferralData = React.useCallback(() => {
    const storedInfo = getStoredReferrerInfo();
    const storedAddress = storedInfo?.referrerAddress ?? null;

    setStoredReferralAddress(storedAddress);

    // Rank 1: URL parameters
    const hasUrlReferralAddress = urlReferralAddress != null;
    if (hasUrlReferralAddress && isValidAddress(urlReferralAddress)) {
      setReferralAddress(urlReferralAddress);
      return;
    }

    // Rank 2: ClientStorage
    const hasStoredReferralAddress = storedAddress != null;
    if (hasStoredReferralAddress) {
      if (storedAddress === "" || isValidAddress(storedAddress)) {
        setReferralAddress(storedAddress);
        return;
      }
    }

    // Rank 3: API Resopnse(by leaderboard)
    if (!hasUrlReferralAddress && !hasStoredReferralAddress) {
      const isValidApiReferrer =
        apiReferrerAddress && isValidAddress(apiReferrerAddress) && apiReferrerAddress !== account?.address;

      setReferralAddress(isValidApiReferrer ? apiReferrerAddress : "");
    }
  }, [urlReferralAddress, apiReferrerAddress, account?.address, getStoredReferrerInfo]);

  // Handling URL parameters and ClientStorage priorities
  React.useEffect(() => {
    refreshReferralData();
  }, [urlReferralAddress, storedReferralAddress, apiReferrerAddress, saveToLocalStorage, account?.address]);

  return {
    referralAddress,
    apiReferrerAddress,
    storedReferralAddress,
    referralEarnedPoints,
    saveReferrerAddress,
    generateReferralLink,
    getCurrentReferralAddress: () => referralAddressRef.current,
    refetchLeaderboardMyInfo,
    refreshReferralData,
    removeReferrerFromUrl,
    removeReferrerFromLocalStorage,
  };
};
