import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";

import { DEVICE_TYPE } from "@styles/media";
import { useReferral } from "@hooks/common/use-referral";
import { formatAddress } from "@utils/string-utils";

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

const COPY_SUCCESS_NOTIFICATION_DURATION = 3_000;

const WalletReferralInfo = ({ account, breakpoint }: WalletReferralInfoProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [copied, setCopied] = React.useState<boolean>(false);
  const [uiState, setUIState] = React.useState<UIState>({
    isEditing: false,
    showError: false,
  });

  const [inputReferralAddress, setInputReferralAddress] = React.useState<string>("");
  const {
    storedReferralAddress,
    apiReferrerAddress,
    referralEarnedPoints,
    saveReferrerAddress,
    generateReferralLink,
    refreshReferralData,
    refetchLeaderboardMyInfo,
  } = useReferral();

  const componentRef = React.useRef<HTMLDivElement>(null);

  // Refresh data when the entire browser window is reactivated
  React.useEffect(() => {
    const handleFocus = () => {
      refetchLeaderboardMyInfo();
      refreshReferralData();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [refreshReferralData]);

  // Refreshes data when focus moves to this component from another element within the same page.
  React.useEffect(() => {
    const currentRef = componentRef.current;

    if (currentRef) {
      const handleComponentFocus = () => {
        refreshReferralData();
      };

      currentRef.addEventListener("focusin", handleComponentFocus);

      return () => {
        currentRef.removeEventListener("focusin", handleComponentFocus);
      };
    }
  }, [refreshReferralData]);

  // Refreshes data when the account address changes.
  React.useEffect(() => {
    refetchLeaderboardMyInfo();
    refreshReferralData();
  }, [account?.address, refreshReferralData]);

  const referralLink = React.useMemo(() => generateReferralLink(), [generateReferralLink]);

  const displayReferralLink = React.useMemo(() => {
    if (!account?.address) return "";

    return `.../${formatAddress(account?.address, 4)}`;
  }, [account?.address]);

  const referrerAddressInfo = React.useMemo(() => {
    const address = storedReferralAddress ?? apiReferrerAddress;

    if (!address) return { fullAddress: null, shortAddress: null };

    return { fullAddress: address, shortAddress: formatAddress(address, 5) };
  }, [storedReferralAddress, apiReferrerAddress]);

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

  const isSubmittable = React.useMemo(() => {
    return true;
  }, []);

  const handleInputReferralAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uiState.showError) setUIState(prev => ({ ...prev, showError: false }));
    setInputReferralAddress(e.target.value);
  };

  const handleEdit = () => {
    refreshReferralData();

    if (referrerAddressInfo.fullAddress) {
      setInputReferralAddress(referrerAddressInfo.fullAddress);
    }
    setUIState(prev => ({ ...prev, isEditing: true }));
  };

  const handleEditExit = () => {
    setInputReferralAddress("");
    setUIState({ isEditing: false, showError: false });
  };

  const handleSubmit = () => {
    if (!isSubmittable || uiState.showError) return;

    const result = saveReferrerAddress(inputReferralAddress);

    if (!result.success) {
      setUIState(prev => ({ ...prev, showError: true }));
      return;
    }

    handleEditExit();
    refreshReferralData();
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
              <S.InfoReferrerDisplayText hasRegisteredReferrer={!!referrerAddressInfo.shortAddress}>
                {referrerAddressInfo.shortAddress ? referrerAddressInfo.shortAddress : t("Not registered yet")}
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
          <span>{referralEarnedPoints.toLocaleString()}</span>
        </S.InfoColumnValue>
      </S.WalletReferralInfoColumn>
    </S.WalletReferralInfoWrapper>
  );
};

export default WalletReferralInfo;
