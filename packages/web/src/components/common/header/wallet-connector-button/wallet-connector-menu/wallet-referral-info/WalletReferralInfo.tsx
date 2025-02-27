import React from "react";
import { useTranslation } from "react-i18next";

import * as S from "./WalletReferralInfo.styles";
import { AccountModel } from "@models/account/account-model";
import IconCopy from "@components/common/icons/IconCopy";
import { CopyTooltip } from "../WalletConnectorMenu.styles";
import IconPolygon from "@components/common/icons/IconPolygon";

interface WalletReferralInfoProps {
  account: AccountModel | null;
}

const COPY_SUCCESS_NOTIFICATION_DURATION = 3_000;

const WalletReferralInfo = ({ account }: WalletReferralInfoProps) => {
  const { t } = useTranslation();

  const [copied, setCopied] = React.useState(false);

  const referralLink = React.useMemo(() => {
    if (typeof window === "undefined" || !account?.address) return "";

    const url = new URL(window.location.origin);
    url.searchParams.set("ref", account.address);
    return url.toString();
  }, [account?.address]);

  const displayReferralLink = React.useMemo(() => {
    if (!account?.address) return "";

    return `.../${account?.address.slice(0, 4)}...${account?.address.slice(-4)}`;
  }, [account?.address]);

  const handleCopy = React.useCallback(async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_SUCCESS_NOTIFICATION_DURATION);
    } catch (e: unknown) {
      throw new Error(`Copy Error! ${e}`);
    }
  }, [referralLink]);

  const mockData = {
    referredBy: "",
    earnedPoints: 1000000,
  };

  return (
    <S.WalletReferralInfoWrapper>
      {/* My Referral Link */}
      <S.WalletReferralInfoColumn>
        <S.InfoColumnKey>{t("My Referral Link")}</S.InfoColumnKey>
        <S.InfoColumnValue>
          <span>{displayReferralLink}</span>
          <button onClick={handleCopy}>
            <IconCopy className="copy-icon" />
            {copied && (
              <CopyTooltip>
                <div className={"box dark-shadow"}>
                  <span>Copied!</span>
                </div>
                <IconPolygon className="polygon-icon" />
              </CopyTooltip>
            )}
          </button>
        </S.InfoColumnValue>
      </S.WalletReferralInfoColumn>
      {/* Referred by */}
      <S.WalletReferralInfoColumn>
        <S.InfoColumnKey>{t("Referred by")}</S.InfoColumnKey>
        <S.InfoColumnValue>
          <span>{t("Not registered yet")}</span>
        </S.InfoColumnValue>
      </S.WalletReferralInfoColumn>
      {/* Earned Points */}
      <S.WalletReferralInfoColumn>
        <S.InfoColumnKey>{t("Earned Points")}</S.InfoColumnKey>
        <S.InfoColumnValue>
          <span>{mockData.earnedPoints.toLocaleString()}</span>
        </S.InfoColumnValue>
      </S.WalletReferralInfoColumn>
    </S.WalletReferralInfoWrapper>
  );
};

export default WalletReferralInfo;
