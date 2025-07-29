import React from "react";
import Image from "next/image";
import { useAtom, useAtomValue } from "jotai";
import { useTranslation, Trans } from "react-i18next";

import { LaunchpadState } from "@states/index";
import { useLaunchpadHandler } from "@hooks/launchpad/data/use-launchpad-handler";
import { LaunchpadPoolModel } from "@models/launchpad";
import { GNS_TOKEN } from "@common/values/token-constant";
import { ProjectRewardInfoModel } from "../../LaunchpadDetail";
import { getClaimableTime } from "@utils/launchpad-get-claimable";
import { getDateUtcToLocal } from "@common/utils/date-util";
import { PROJECT_STATUS_TYPE } from "@common/values";
import { useTokenAmountInput } from "@hooks/token/data/use-token-amount-input";

import { Divider } from "@components/common/divider/divider";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { LaunchpadParticipateWrapper } from "./LaunchpadParticipate.styles";
import LaunchpadPoolTierChip from "@layouts/launchpad/components/launchpad-pool-tier-chip/LaunchpadPoolTierChip";
import DepositConditionsTooltip from "@components/common/launchpad-tooltip/deposit-conditions-tooltip/DepositConditionsTooltip";
import LaunchpadTooltip from "../common/launchpad-tooltip/LaunchpadTooltip";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import LaunchpadDepositModal from "@components/common/launchpad-modal/launchpad-deposit-modal/LaunchpadDepositModal";
import TokenAmountInput from "@components/common/token-amount-input/TokenAmountInput";

const DEFAULT_DEPOSIT_TOKEN = GNS_TOKEN;

interface LaunchpadParticipateProps {
  poolInfo?: LaunchpadPoolModel;
  rewardInfo: ProjectRewardInfoModel;
  status: string;
  projectPath: string;
  isLoading: boolean;
  isWalletConnected: boolean;

  depositGNS: (projectPoolId: string, depositAmount: string) => void;
  refetch: () => Promise<void>;
}

const defaultStyle = {
  fullWidth: true,
  hierarchy: ButtonHierarchy.Primary,
};

const LaunchpadParticipate: React.FC<LaunchpadParticipateProps> = ({
  poolInfo,
  rewardInfo,
  status,
  projectPath,
  isLoading,
  isWalletConnected,
  depositGNS,
  refetch,
}) => {
  const { t } = useTranslation();

  // Global State
  const depositConditions = useAtomValue(LaunchpadState.depositConditions);

  const [participateAmount, setParticipateAmount] = useAtom(LaunchpadState.participateAmount);
  const isShowConditionTooltip = useAtomValue(LaunchpadState.isShowConditionTooltip);

  // Modal
  const [isOpenDepositConfirmModal, setIsOpenDepositConfirmModal] = React.useState(false);

  const gnsAmountInput = useTokenAmountInput(DEFAULT_DEPOSIT_TOKEN);

  const {
    depositButtonText,
    openConnectWallet,
    isSwitchNetwork,
    switchNetwork,
    isAvailableDeposit,
    isDepositAllowed,
    showConditionTooltip,
    hideConditionTooltip,
  } = useLaunchpadHandler();

  const claimableTimeStamp = getClaimableTime(poolInfo?.claimableThreshold);
  const claimableTimeFormat = claimableTimeStamp ? getDateUtcToLocal(claimableTimeStamp).value : "-";

  // Initialize Page State
  React.useEffect(() => {
    if (depositConditions.length > 0) {
      showConditionTooltip();
    } else {
      hideConditionTooltip();
    }

    setParticipateAmount("");
  }, [showConditionTooltip, hideConditionTooltip, setParticipateAmount, depositConditions.length]);

  const buttonRender = React.useCallback(() => {
    if (status === "UPCOMING") {
      return (
        <div className="participate-button-wrapper">
          <DepositButton
            isAvailableDeposit={isAvailableDeposit}
            isSwitchNetwork={isSwitchNetwork}
            isWalletConnected={isWalletConnected}
            status={status}
            isDepositAllowed={isDepositAllowed}
            text={depositButtonText}
            openConnectWallet={openConnectWallet}
            switchNetwork={switchNetwork}
            openLaunchpadDepositAction={() => {
              setIsOpenDepositConfirmModal(true);
            }}
          />
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="participate-button-wrapper">
          <Button style={{ ...defaultStyle, hierarchy: ButtonHierarchy.Gray }} text={t("Launchpad:common.upcoming")} />
        </div>
      );
    }

    return (
      <div className="participate-button-wrapper">
        <DepositButton
          isAvailableDeposit={isAvailableDeposit}
          isSwitchNetwork={isSwitchNetwork}
          isWalletConnected={isWalletConnected}
          status={status}
          isDepositAllowed={isDepositAllowed}
          text={depositButtonText}
          openConnectWallet={openConnectWallet}
          switchNetwork={switchNetwork}
          openLaunchpadDepositAction={() => {
            setIsOpenDepositConfirmModal(true);
          }}
        />
      </div>
    );
  }, [status, isLoading, depositButtonText]);

  return (
    <LaunchpadParticipateWrapper>
      <div className="participate-header">
        <div>{t("Launchpad:participate.title")}</div>
        {isShowConditionTooltip && <DepositConditionsTooltip />}
      </div>

      <TokenAmountInput
        {...gnsAmountInput}
        token={DEFAULT_DEPOSIT_TOKEN}
        connected={isWalletConnected}
        changeAmount={gnsAmountInput.changeAmount}
        changeToken={() => {}}
        style={{ padding: "16px 24px" }}
      />

      <Divider />

      <div className="participate-info-wrapper">
        <div className="participate-info">
          <div className="participate-info-key">{t("Launchpad:participate.col.poolTier")}</div>
          {!isLoading && (
            <div className="participate-info-value">
              {poolInfo?.poolTier ? <LaunchpadPoolTierChip poolTier={poolInfo.poolTier} /> : "-"}
            </div>
          )}
          {isLoading && <div css={pulseSkeletonStyle({ w: 103, h: 17 })} />}
        </div>
        <div className="participate-info">
          <div className="participate-info-key">
            {t("Launchpad:participate.col.rewardsClaimableOn")}{" "}
            <LaunchpadTooltip
              floatingContent={
                <Trans ns="Launchpad" i18nKey="common.tooltip.rewardsClaimableOn">
                  Rewards will be claimable after this <br />
                  time.
                </Trans>
              }
            />
          </div>
          {!isLoading && <div className="participate-info-value">{claimableTimeFormat}</div>}
          {isLoading && <div css={pulseSkeletonStyle({ w: 103, h: 17 })} />}
        </div>
        <div className="participate-info">
          <div className="participate-info-key">
            {t("Launchpad:participate.col.endDate")}{" "}
            <LaunchpadTooltip
              floatingContent={<Trans ns="Launchpad" components={{ br: <br /> }} i18nKey="common.tooltip.endDate" />}
            />
          </div>
          {!isLoading && (
            <div className="participate-info-value">
              {poolInfo?.endTime ? getDateUtcToLocal(poolInfo.endTime).value : "-"}
            </div>
          )}
          {isLoading && <div css={pulseSkeletonStyle({ w: 103, h: 17 })} />}
        </div>
        <div className="participate-info">
          <div className="participate-info-key">{t("Launchpad:participate.col.depositAmount")}</div>
          {!isLoading && (
            <div className="participate-info-value">
              <Image src="/gns.svg" width={24} height={24} alt="GNS Symbol image" />
              <span>{participateAmount ? participateAmount : "-"}</span>
            </div>
          )}
          {isLoading && <div css={pulseSkeletonStyle({ w: 103, h: 24 })} />}
        </div>
      </div>

      {buttonRender()}

      {isOpenDepositConfirmModal && (
        <LaunchpadDepositModal
          depositAmount={participateAmount}
          poolInfo={poolInfo}
          rewardInfo={rewardInfo}
          projectPath={projectPath}
          isWalletConnected={isWalletConnected}
          refetch={refetch}
          onSubmit={depositGNS}
          setIsOpen={setIsOpenDepositConfirmModal}
        />
      )}
    </LaunchpadParticipateWrapper>
  );
};

interface DepositButtonProps {
  isWalletConnected: boolean;
  text: string;
  isSwitchNetwork: boolean;
  isAvailableDeposit: boolean;
  status: string;
  isDepositAllowed: boolean;

  openConnectWallet: () => void;
  openLaunchpadDepositAction: () => void;
  switchNetwork: () => void;
}

const DepositButton: React.FC<DepositButtonProps> = ({
  isWalletConnected,
  text,
  openConnectWallet,
  isSwitchNetwork,
  status,
  isDepositAllowed,
  isAvailableDeposit,
  switchNetwork,
  openLaunchpadDepositAction,
}) => {
  const { t } = useTranslation();

  if (status !== "ONGOING") {
    const getProjectStatus = (type: PROJECT_STATUS_TYPE) => {
      switch (type) {
        case PROJECT_STATUS_TYPE.UPCOMING:
          return t("Launchpad:common.upcoming");
        case PROJECT_STATUS_TYPE.ENDED:
          return t("Launchpad:common.ended");
      }
    };
    return <Button text={getProjectStatus(status)} style={{ ...defaultStyle, hierarchy: ButtonHierarchy.Gray }} />;
  }

  if (!isWalletConnected) {
    return <Button text={text} style={defaultStyle} onClick={openConnectWallet} />;
  }

  if (isSwitchNetwork) {
    return <Button text={text} style={defaultStyle} onClick={switchNetwork} />;
  }

  if (!isAvailableDeposit) {
    return <Button text={text} style={{ ...defaultStyle, hierarchy: ButtonHierarchy.Gray }} />;
  }

  if (!isDepositAllowed) {
    return <Button text={text} style={{ ...defaultStyle, hierarchy: ButtonHierarchy.Gray }} />;
  }

  return <Button className={"button-deposit"} text={text} style={defaultStyle} onClick={openLaunchpadDepositAction} />;
};

export default LaunchpadParticipate;
