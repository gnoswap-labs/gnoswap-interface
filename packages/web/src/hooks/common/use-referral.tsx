import React from "react";

import useCustomRouter from "./use-custom-router";
import { PACKAGE_REFERRAL_ADDRESS } from "@constants/environment.constant";
import { GNOSWAP_REFERRAL_CODE } from "@states/common";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import {
  hasValidRegisteredReferrer,
  ReferralTransactionIntent,
  resolveReferralAddressForTransaction,
  resolveStoredReferralTransactionIntent,
  StoredReferrerInfo,
} from "@utils/referral-utils";
import { isValidAddress } from "@utils/validation-utils";
import { QUERY_PARAMETER } from "@constants/page.constant";
import { useGetLeaderboardByAddress } from "@query/leaderboard";

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
  const nextReferralAddressRef = React.useRef("");

  React.useEffect(() => {
    referralAddressRef.current = referralAddress;
  }, [account?.address, referralAddress]);

  const urlReferralAddress = router.getReferrerParameter();
  const [storedReferrerInfo, setStoredReferrerInfo] = React.useState<StoredReferrerInfo | null>(null);
  const storedReferralAddress = storedReferrerInfo?.referrerAddress ?? null;
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

  const saveToLocalStorage = React.useCallback(
    (referrerAddress: string, transactionIntent: ReferralTransactionIntent) => {
      if (!account?.address) return;

      const data: StoredReferrerInfo = {
        referrerAddress,
        updatedAt: Date.now(),
        transactionIntent,
      };

      localStorage.setItem(`${GNOSWAP_REFERRAL_CODE}_${account.address}`, JSON.stringify(data));
      setStoredReferrerInfo(data);
    },
    [account?.address],
  );

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

  const saveReferrerAddress = React.useCallback(
    (referrerAddress: string): SaveReferrerResult => {
      if (!account?.address) return { success: false, error: "NO_ACCOUNT" };

      const trimmedAddress = referrerAddress.trim();
      const isNonEmptyAddress = trimmedAddress !== "";
      const transactionIntent: ReferralTransactionIntent = isNonEmptyAddress
        ? "set"
        : hasValidRegisteredReferrer(apiReferrerAddress, account.address)
          ? "reset"
          : "keep";

      if (isNonEmptyAddress && !isValidAddress(trimmedAddress)) {
        return { success: false, error: "INVALID_ADDRESS" };
      }

      if (isNonEmptyAddress && trimmedAddress === account.address) {
        return { success: false, error: "SELF_REFERRAL" };
      }

      removeReferrerFromUrl();
      saveToLocalStorage(trimmedAddress, transactionIntent);

      return { success: true };
    },
    [account?.address, apiReferrerAddress, removeReferrerFromUrl, saveToLocalStorage],
  );

  const removeReferrerFromLocalStorage = React.useCallback(() => {
    if (!account?.address) return;
    localStorage.removeItem(`${GNOSWAP_REFERRAL_CODE}_${account.address}`);
    setStoredReferrerInfo(null);
  }, [account?.address]);

  const refreshReferralData = React.useCallback(() => {
    const nextStoredReferrerInfo = getStoredReferrerInfo();
    const storedAddress = nextStoredReferrerInfo?.referrerAddress ?? null;
    const storedTransactionIntent = resolveStoredReferralTransactionIntent(
      nextStoredReferrerInfo,
      apiReferrerAddress,
      account?.address,
    );

    setStoredReferrerInfo(nextStoredReferrerInfo);

    if (hasValidRegisteredReferrer(urlReferralAddress || "", account?.address)) {
      setReferralAddress(urlReferralAddress || "");
      return;
    }

    if (storedAddress != null) {
      if (storedTransactionIntent === "set" && isValidAddress(storedAddress)) {
        setReferralAddress(storedAddress);
        return;
      }

      setReferralAddress("");
      return;
    }

    setReferralAddress(hasValidRegisteredReferrer(apiReferrerAddress, account?.address) ? apiReferrerAddress : "");
  }, [urlReferralAddress, apiReferrerAddress, account?.address, getStoredReferrerInfo]);

  React.useEffect(() => {
    nextReferralAddressRef.current = resolveReferralAddressForTransaction({
      urlReferralAddress,
      storedReferrerInfo,
      apiReferrerAddress,
      accountAddress: account?.address,
      packageReferralAddress: PACKAGE_REFERRAL_ADDRESS,
    });
  }, [urlReferralAddress, storedReferrerInfo, apiReferrerAddress, account?.address]);

  React.useEffect(() => {
    refreshReferralData();
  }, [urlReferralAddress, storedReferralAddress, apiReferrerAddress, refreshReferralData, account?.address]);

  const getCurrentReferralAddress = React.useCallback(() => referralAddressRef.current, []);
  const getNextReferralAddress = React.useCallback(() => nextReferralAddressRef.current, []);

  return {
    referralAddress,
    apiReferrerAddress,
    storedReferralAddress,
    referralEarnedPoints,
    saveReferrerAddress,
    generateReferralLink,
    getCurrentReferralAddress,
    getNextReferralAddress,
    refetchLeaderboardMyInfo,
    refreshReferralData,
    removeReferrerFromUrl,
    removeReferrerFromLocalStorage,
  };
};
