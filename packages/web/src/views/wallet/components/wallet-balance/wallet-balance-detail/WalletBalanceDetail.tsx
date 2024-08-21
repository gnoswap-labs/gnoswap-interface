import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { DEVICE_TYPE } from "@styles/media";
import { formatUSDWallet } from "@utils/number-utils";

import WalletBalanceDetailInfo, {
  WalletBalanceDetailInfoTooltip,
} from "./wallet-balance-detail-info/WalletBalanceDetailInfo";

import {
  InfoWrapper,
  WalletBalanceDetailWrapper,
} from "./WalletBalanceDetail.styles";


export interface BalanceDetailInfo {
  availableBalance: string;
  stakedLP: string;
  unstakedLP: string;
  claimableRewards: string;
  loadingBalance: boolean;
  loadingPositions: boolean;
  totalClaimedRewards: string;
}

interface WalletBalanceDetailProps {
  balanceDetailInfo: BalanceDetailInfo;
  connected: boolean;
  isSwitchNetwork: boolean;
  claimAll: () => void;
  breakpoint: DEVICE_TYPE;
  loadngTransactionClaim: boolean;
}

const WalletBalanceDetail: React.FC<WalletBalanceDetailProps> = ({
  balanceDetailInfo,
  connected,
  claimAll,
  breakpoint,
  isSwitchNetwork,
  loadngTransactionClaim,
}) => {
  const { t } = useTranslation();

  return (
    <WalletBalanceDetailWrapper>
      <WalletBalanceDetailInfo
        loading={balanceDetailInfo.loadingBalance}
        title={t("Wallet:overral.availBal.label")}
        value={balanceDetailInfo.availableBalance}
        tooltip={t("Wallet:overral.availBal.tooltip")}
      />
      <WalletBalanceDetailInfo
        loading={balanceDetailInfo.loadingPositions}
        title={t("Wallet:overral.stakedPosi.label")}
        value={balanceDetailInfo.stakedLP}
        tooltip={t("Wallet:overral.stakedPosi.tooltip")}
      />
      <WalletBalanceDetailInfo
        loading={balanceDetailInfo.loadingPositions}
        title={t("Wallet:overral.totalClaimed.label")}
        value={balanceDetailInfo.totalClaimedRewards}
        tooltip={t("Wallet:overral.totalClaimed.tooltip")}
      />
      {breakpoint === DEVICE_TYPE.MOBILE ? (
        <InfoWrapper>
          <div className="column-batch">
            <div className="title-wrapper">
              <span className="title">
                {t("Wallet:overral.claimableReward.label")}
              </span>
              <WalletBalanceDetailInfoTooltip
                tooltip={t("Wallet:overral.claimableReward.tooltip")}
              />
            </div>
            <div className="value-wrapper">
              {balanceDetailInfo.loadingPositions ? (
                <div className="value">
                  <span css={pulseSkeletonStyle({ h: 20, w: "120px" })} />
                </div>
              ) : (
                <span className="value">
                  {formatUSDWallet(balanceDetailInfo.claimableRewards, true)}
                </span>
              )}
            </div>
          </div>
          <div className="button-wrapper">
            <ClaimAllButton
              onClick={claimAll}
              loadngTransactionClaim={loadngTransactionClaim}
              disabled={
                connected === false ||
                isSwitchNetwork ||
                Number(balanceDetailInfo.claimableRewards) === 0
              }
            />
          </div>
        </InfoWrapper>
      ) : (
        <WalletBalanceDetailInfo
          loading={balanceDetailInfo.loadingPositions}
          title={t("Wallet:overral.claimableReward.label")}
          value={balanceDetailInfo.claimableRewards}
          tooltip={t("Wallet:overral.claimableReward.tooltip")}
          className="claimable-rewards"
          button={
            <ClaimAllButton
              onClick={claimAll}
              loadngTransactionClaim={loadngTransactionClaim}
              disabled={
                connected === false ||
                isSwitchNetwork ||
                Number(balanceDetailInfo.claimableRewards) === 0
              }
            />
          }
        />
      )}
    </WalletBalanceDetailWrapper>
  );
};

interface ClaimAllButtonProps {
  disabled: boolean;
  onClick: () => void;
  loadngTransactionClaim: boolean;
}

const ClaimAllButton: React.FC<ClaimAllButtonProps> = ({
  disabled,
  onClick,
  loadngTransactionClaim,
}) => {
  const { t } = useTranslation();

  return (
    <Button
      style={{
        minWidth: 86,
        fontType: "p1",
        padding: loadngTransactionClaim ? "8px 16px" : "10px 16px",
        hierarchy: ButtonHierarchy.Primary,
      }}
      text={loadngTransactionClaim ? "" : t("Wallet:overral.claimAll.btn")}
      onClick={onClick}
      disabled={disabled}
      leftIcon={
        loadngTransactionClaim ? (
          <LoadingSpinner className="loading-button" />
        ) : undefined
      }
    />
  );
};

export default WalletBalanceDetail;
