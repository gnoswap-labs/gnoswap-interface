import { isValidAddress } from "@utils/validation-utils";

export type ReferralTransactionIntent = "keep" | "reset" | "set";

export interface StoredReferrerInfo {
  referrerAddress: string;
  updatedAt: number;
  transactionIntent?: ReferralTransactionIntent;
}

const isSameReferralAddress = (address: string, accountAddress?: string | null) => {
  return !!accountAddress && address === accountAddress;
};

export const hasValidRegisteredReferrer = (referrerAddress: string, accountAddress?: string | null) => {
  return !!referrerAddress && isValidAddress(referrerAddress) && !isSameReferralAddress(referrerAddress, accountAddress);
};

export const resolveStoredReferralTransactionIntent = (
  storedReferrerInfo: StoredReferrerInfo | null,
  apiReferrerAddress: string,
  accountAddress?: string | null,
): ReferralTransactionIntent | null => {
  if (!storedReferrerInfo) {
    return null;
  }

  if (storedReferrerInfo.transactionIntent) {
    return storedReferrerInfo.transactionIntent;
  }

  if (storedReferrerInfo.referrerAddress === "") {
    return hasValidRegisteredReferrer(apiReferrerAddress, accountAddress) ? "reset" : "keep";
  }

  return "set";
};

export const resolveReferralAddressForTransaction = ({
  urlReferralAddress,
  storedReferrerInfo,
  apiReferrerAddress,
  accountAddress,
  packageReferralAddress,
}: {
  urlReferralAddress?: string | null;
  storedReferrerInfo: StoredReferrerInfo | null;
  apiReferrerAddress: string;
  accountAddress?: string | null;
  packageReferralAddress: string;
}) => {
  if (hasValidRegisteredReferrer(urlReferralAddress || "", accountAddress)) {
    return urlReferralAddress || "";
  }

  const transactionIntent = resolveStoredReferralTransactionIntent(storedReferrerInfo, apiReferrerAddress, accountAddress);

  if (transactionIntent === "reset") {
    return packageReferralAddress || "";
  }

  if (transactionIntent === "set") {
    return hasValidRegisteredReferrer(storedReferrerInfo?.referrerAddress || "", accountAddress)
      ? storedReferrerInfo?.referrerAddress || ""
      : "";
  }

  return "";
};
