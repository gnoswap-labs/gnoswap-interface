import React from "react";
import Image from "next/image";
import { useAtom, useAtomValue } from "jotai";
import BigNumber from "bignumber.js";

import { LaunchpadState } from "@states/index";
import { useLaunchpadHandler } from "@hooks/launchpad/use-launchpad-handler";
import { useTokenData } from "@hooks/token/use-token-data";
import { isAmount } from "@common/utils/data-check-util";
import { LaunchpadPoolModel } from "@models/launchpad";
import { GNS_TOKEN } from "@common/values/token-constant";
import { useLaunchpadDepositConfirmModal } from "../../hooks/use-launchpad-deposit-confirm-modal";
import { ProjectRewardInfoModel } from "../../LaunchpadDetail";
import { capitalize } from "@utils/string-utils";
import { toNumberFormat } from "@utils/number-utils";
import { formatPrice } from "@utils/new-number-utils";
import { getClaimableTime } from "@utils/launchpad-get-claimable-time";
import { getDateUtcToLocal } from "@common/utils/date-util";

import { Divider } from "@components/common/divider/divider";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import { LaunchpadParticipateWrapper } from "./LaunchpadParticipate.styles";
import LaunchpadPoolTierChip from "@views/launchpad/components/launchpad-pool-tier-chip/LaunchpadPoolTierChip";
import DepositConditionsTooltip from "@components/common/launchpad-tooltip/deposit-conditions-tooltip/DepositConditionsTooltip";
import LaunchpadTooltip from "../common/launchpad-tooltip/LaunchpadTooltip";

const DEFAULT_DEPOSIT_TOKEN = GNS_TOKEN;

interface LaunchpadParticipateProps {
  poolInfo?: LaunchpadPoolModel;
  rewardInfo: ProjectRewardInfoModel;
  status: string;

  refetch: () => Promise<void>;
}

const LaunchpadParticipate: React.FC<LaunchpadParticipateProps> = ({
  poolInfo,
  rewardInfo,
  status,
  refetch,
}) => {
  const depositConditions = useAtomValue(LaunchpadState.depositConditions);

  const [participateAmount, setParticipateAmount] = useAtom(
    LaunchpadState.participateAmount,
  );
  const isShowConditionTooltip = useAtomValue(
    LaunchpadState.isShowConditionTooltip,
  );

  const {
    connectedWallet,
    depositButtonText,
    openConnectWallet,
    isSwitchNetwork,
    switchNetwork,
    isAvailableDeposit,
    isDepositAllowed,
    showConditionTooltip,
    hideConditionTooltip,
  } = useLaunchpadHandler();
  const { tokenPrices, displayBalanceMap } = useTokenData();
  const onChangeParticipateAmount = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (status !== "UPCOMING") {
        const value = e.target.value;

        if (value !== "" && !isAmount(value)) return;
        setParticipateAmount(value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1"));
      }
    },
    [setParticipateAmount, status],
  );

  const { openLaunchpadDepositModal, closeLaunchpadDepositModal } =
    useLaunchpadDepositConfirmModal({
      participateAmount,
      poolInfo,
      rewardInfo,
      refetch: async () => {
        await refetch();
        closeLaunchpadDepositModal();
      },
    });

  const currentGnsBalance = React.useMemo(
    () => displayBalanceMap?.[DEFAULT_DEPOSIT_TOKEN?.path ?? ""] ?? null,
    [displayBalanceMap],
  );
  const estimatePrice = React.useMemo(
    () =>
      DEFAULT_DEPOSIT_TOKEN?.wrappedPath &&
      !!participateAmount &&
      participateAmount !== "0"
        ? formatPrice(
            BigNumber(+participateAmount)
              .multipliedBy(
                Number(
                  tokenPrices?.[DEFAULT_DEPOSIT_TOKEN?.wrappedPath]?.usd ?? "0",
                ),
              )
              .toString(),
            {
              usd: true,
              isKMB: false,
            },
          )
        : "-",
    [participateAmount, tokenPrices],
  );

  const claimableTimeStamp = getClaimableTime(poolInfo?.claimableThreshold);
  const claimableTimeFormat = claimableTimeStamp
    ? getDateUtcToLocal(claimableTimeStamp).value
    : "-";

  // Initialize Page State
  React.useEffect(() => {
    if (depositConditions.length > 0) {
      showConditionTooltip();
    } else {
      hideConditionTooltip();
    }

    setParticipateAmount("");
  }, [
    showConditionTooltip,
    hideConditionTooltip,
    setParticipateAmount,
    depositConditions.length,
  ]);

  return (
    <LaunchpadParticipateWrapper>
      <div className="participate-header">
        <div>Participate</div>
        {isShowConditionTooltip && <DepositConditionsTooltip />}
      </div>

      <div className="participate-input-wrapper">
        <div className="participate-input-amount">
          <input
            className="participate-amount-text"
            placeholder="0"
            value={participateAmount}
            onChange={onChangeParticipateAmount}
          />
          <div className="participate-token-selector">
            <SelectPairButton
              token={DEFAULT_DEPOSIT_TOKEN}
              isHiddenArrow
              disabled
            />
          </div>
        </div>

        <div className="participate-amount-info">
          <span className="participate-price-text">{estimatePrice}</span>
          <span className="participate-balance-text">
            Balance:{" "}
            {currentGnsBalance ? toNumberFormat(currentGnsBalance, 2) : "-"}
          </span>
        </div>
      </div>

      <Divider />

      <div className="participate-info-wrapper">
        <div className="participate-info">
          <div className="participate-info-key">Pool Tier</div>
          <div className="participate-info-value">
            {poolInfo?.poolTier ? (
              <LaunchpadPoolTierChip poolTier={poolInfo.poolTier} />
            ) : (
              "-"
            )}
          </div>
        </div>
        <div className="participate-info">
          <div className="participate-info-key">
            Rewards Claimable On{" "}
            <LaunchpadTooltip
              floatingContent={
                <>
                  Rewards will be claimable after this <br />
                  time.
                </>
              }
            />
          </div>
          <div className="participate-info-value">{claimableTimeFormat}</div>
        </div>
        <div className="participate-info">
          <div className="participate-info-key">
            End Date{" "}
            <LaunchpadTooltip
              floatingContent={
                <>
                  The launchpad program you selected <br />
                  ends on this date.
                </>
              }
            />
          </div>
          <div className="participate-info-value">
            {poolInfo?.endTime
              ? getDateUtcToLocal(poolInfo.endTime).value
              : "-"}
          </div>
        </div>
        <div className="participate-info">
          <div className="participate-info-key">Deposit Amount</div>
          <div className="participate-info-value">
            <Image
              src="/gns.svg"
              width={24}
              height={24}
              alt="GNS Symbol image"
            />
            {participateAmount
              ? `${toNumberFormat(Number(participateAmount), 2)} ${
                  DEFAULT_DEPOSIT_TOKEN.symbol
                }`
              : "-"}
          </div>
        </div>
      </div>

      <div className="participate-button-wrapper">
        <DepositButton
          isAvailableDeposit={isAvailableDeposit}
          isSwitchNetwork={isSwitchNetwork}
          connectedWallet={connectedWallet}
          status={status}
          isDepositAllowed={isDepositAllowed}
          text={depositButtonText}
          openConnectWallet={openConnectWallet}
          switchNetwork={switchNetwork}
          openLaunchpadDepositAction={openLaunchpadDepositModal}
        />
      </div>
    </LaunchpadParticipateWrapper>
  );
};

interface DepositButtonProps {
  connectedWallet: boolean;
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
  connectedWallet,
  text,
  openConnectWallet,
  isSwitchNetwork,
  status,
  isDepositAllowed,
  isAvailableDeposit,
  switchNetwork,
  openLaunchpadDepositAction,
}) => {
  const defaultStyle = {
    fullWidth: true,
    hierarchy: ButtonHierarchy.Primary,
  };

  if (status !== "ONGOING") {
    return (
      <Button
        text={capitalize(status)}
        style={{ ...defaultStyle, hierarchy: ButtonHierarchy.Gray }}
      />
    );
  }

  if (!connectedWallet) {
    return (
      <Button text={text} style={defaultStyle} onClick={openConnectWallet} />
    );
  }

  if (isSwitchNetwork) {
    return <Button text={text} style={defaultStyle} onClick={switchNetwork} />;
  }

  if (!isAvailableDeposit) {
    return (
      <Button
        text={text}
        style={{ ...defaultStyle, hierarchy: ButtonHierarchy.Gray }}
      />
    );
  }

  if (!isDepositAllowed) {
    return (
      <Button
        text={text}
        style={{ ...defaultStyle, hierarchy: ButtonHierarchy.Gray }}
      />
    );
  }

  return (
    <Button
      className={"button-deposit"}
      text={text}
      style={defaultStyle}
      onClick={openLaunchpadDepositAction}
    />
  );
};

export default LaunchpadParticipate;
