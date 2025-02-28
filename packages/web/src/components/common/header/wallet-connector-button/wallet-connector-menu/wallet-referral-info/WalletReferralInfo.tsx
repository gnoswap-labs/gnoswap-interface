import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";

import { isValidAddress } from "@utils/validation-utils";
import { QUERY_PARAMETER } from "@constants/page.constant";
import { DEVICE_TYPE } from "@styles/media";

import * as S from "./WalletReferralInfo.styles";
import { AccountModel } from "@models/account/account-model";
import IconCopy from "@components/common/icons/IconCopy";
import { CopyTooltip } from "../WalletConnectorMenu.styles";
import IconPolygon from "@components/common/icons/IconPolygon";
import IconReferredEdit from "@components/common/icons/IconReferredEdit";
import IconReferredEnter from "@components/common/icons/IconReferredEnter";
import IconReferredCancel from "@components/common/icons/IconReferredCancel";
import IconReferredFail from "@components/common/icons/IconReferredFail";
import Tooltip from "@components/common/tooltip/Tooltip";
import IconInfo from "@components/common/icons/IconInfo";
import { ReferralBannerContent } from "./WalletReferralBanner";

interface WalletReferralInfoProps {
  account: AccountModel | null;
  breakpoint: DEVICE_TYPE;
}

interface UIState {
  isEditing: boolean;
  showError: boolean;
}

interface StoredReferralInfo {
  referrerAddress: string;
  updatedAt: number;
}

const STORAGE_KEY = {
  REFERRAL: "wallet_referral_info",
};

const COPY_SUCCESS_NOTIFICATION_DURATION = 3_000;

const WalletReferralInfo = ({ account, breakpoint }: WalletReferralInfoProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [copied, setCopied] = React.useState<boolean>(false);
  const [uiState, setUIState] = React.useState<UIState>({
    isEditing: false,
    showError: false,
  });

  const [storedReferrer, setStoredReferrer] = React.useState<string>("");
  const [inputReferralAddress, setInputReferralAddress] = React.useState<string>("");

  React.useEffect(() => {
    if (!account?.address) return;

    const storedData = localStorage.getItem(`${STORAGE_KEY.REFERRAL}_${account.address}`);
    if (storedData) {
      try {
        const parsed: StoredReferralInfo = JSON.parse(storedData);
        setStoredReferrer(parsed.referrerAddress);
      } catch (e) {
        console.error("Failed to parse stored referral data:", e);
      }
    }
  }, [account?.address]);

  const referralLink = React.useMemo(() => {
    if (typeof window === "undefined" || !account?.address) return "";

    const url = new URL(window.location.origin);
    url.searchParams.set(QUERY_PARAMETER.REFERRER, account.address);
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
    earnedPoints: 0,
  };

  const saveReferralInfo = React.useCallback(
    (referrerAddress: string) => {
      if (!account?.address) return;

      const data: StoredReferralInfo = {
        referrerAddress,
        updatedAt: Date.now(),
      };

      localStorage.setItem(`${STORAGE_KEY.REFERRAL}_${account.address}`, JSON.stringify(data));
      setStoredReferrer(referrerAddress);
    },
    [account?.address],
  );

  const isSubmittable = React.useMemo(() => {
    return true;
  }, []);

  const handleInputReferralAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uiState.showError) setUIState(prev => ({ ...prev, showError: false }));
    setInputReferralAddress(e.target.value);
  };

  const handleEdit = () => {
    setUIState(prev => ({ ...prev, isEditing: true }));
  };

  const handleEditExit = () => {
    setInputReferralAddress("");
    setUIState({ isEditing: false, showError: false });
  };

  const handleSubmit = () => {
    if (!isSubmittable || uiState.showError) return;

    const trimmedAddress = inputReferralAddress.trim();

    if (trimmedAddress && (!isValidAddress(trimmedAddress) || account?.address === trimmedAddress)) {
      setUIState(prev => ({ ...prev, showError: true }));
      return;
    }

    saveReferralInfo(trimmedAddress);
    handleEditExit();
  };

  return (
    <S.WalletReferralInfoWrapper>
      {/* My Referral Link */}
      <S.WalletReferralInfoColumn>
        <S.InfoColumnKey>
          {t("My Referral Link")}
          {breakpoint === DEVICE_TYPE.MOBILE && (
            <Tooltip FloatingContent={<ReferralBannerContent />} placement="top">
              <IconInfo fill={theme.themeKey === "dark" ? "#596782" : "#90A2C0"} size={16} />
            </Tooltip>
          )}
        </S.InfoColumnKey>
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
      <S.WalletReferralInfoColumn isEditing={uiState.isEditing}>
        {uiState.isEditing ? (
          <>
            <S.ReferralInput
              placeholder={t("Enter referrar’s address")}
              value={inputReferralAddress}
              onChange={handleInputReferralAddressChange}
            />
            <S.InfoColumnValue>
              <S.InfoColumnIconSet>
                <S.IconButton
                  aria-label="submit"
                  onClick={handleSubmit}
                  isActive={isSubmittable}
                  isError={uiState.showError}
                  disabled={!isSubmittable}
                >
                  {uiState.showError ? <IconReferredFail /> : <IconReferredEnter />}
                </S.IconButton>
                <S.IconButton aria-label="cancel" onClick={handleEditExit}>
                  <IconReferredCancel />
                </S.IconButton>
              </S.InfoColumnIconSet>
            </S.InfoColumnValue>
          </>
        ) : (
          <>
            <S.InfoColumnKey>{t("Referred by")}</S.InfoColumnKey>
            <S.InfoColumnValue>
              <S.InfoReferrerDisplayText hasRegisteredReferrer={!!storedReferrer}>
                {storedReferrer
                  ? `${storedReferrer.slice(0, 5)}...${storedReferrer.slice(-5)}`
                  : t("Not registered yet")}
              </S.InfoReferrerDisplayText>
              <S.InfoColumnIconSet>
                <S.IconButton aria-label="edit" onClick={handleEdit} className="edit-icon">
                  <IconReferredEdit />
                </S.IconButton>
              </S.InfoColumnIconSet>
            </S.InfoColumnValue>
          </>
        )}
      </S.WalletReferralInfoColumn>
      {uiState.showError && <S.ErrorText>{t("Please enter a valid address")}</S.ErrorText>}

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
