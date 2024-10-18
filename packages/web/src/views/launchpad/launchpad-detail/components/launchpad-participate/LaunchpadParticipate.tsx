import React from "react";
import BigNumber from "bignumber.js";
import { useAtom, useAtomValue } from "jotai";

import { LaunchpadState } from "@states/index";
import { useLaunchpadHandler } from "@hooks/launchpad/use-launchpad-handler";
import { useTokenData } from "@hooks/token/use-token-data";
import { isAmount } from "@common/utils/data-check-util";
import { LaunchpadPoolModel } from "@models/launchpad";
import { GNS_TOKEN } from "@common/values/token-constant";
import { useLaunchpadDepositConfirmModal } from "../../hooks/use-launchpad-deposit-confirm-modal";
import { ProjectRewardInfoModel } from "../../LaunchpadDetail";
import { convertToKMB } from "@utils/stake-position-utils";
import { capitalize } from "@utils/string-utils";

import { Divider } from "@components/common/divider/divider";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconInfo from "@components/common/icons/IconInfo";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import { LaunchpadParticipateWrapper } from "./LaunchpadParticipate.styles";
import LaunchpadPoolTierChip from "@views/launchpad/components/launchpad-pool-tier-chip/LaunchpadPoolTierChip";
import DepositConditionsTooltip from "@components/common/launchpad-tooltip/deposit-conditions-tooltip/DepositConditionsTooltip";

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
      const value = e.target.value;

      if (value !== "" && !isAmount(value)) return;
      setParticipateAmount(value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1"));
    },
    [setParticipateAmount],
  );

  const { openLaunchpadDepositModal } = useLaunchpadDepositConfirmModal({
    participateAmount,
    poolInfo,
    rewardInfo,
    refetch,
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
        ? "$" +
          convertToKMB(
            BigNumber(+participateAmount)
              .multipliedBy(
                Number(
                  tokenPrices?.[DEFAULT_DEPOSIT_TOKEN?.wrappedPath]?.usd ?? "0",
                ),
              )
              .toString(),
            {
              isIgnoreKFormat: true,
            },
          )
        : "-",
    [participateAmount, tokenPrices],
  );

  // Initialize Page State
  React.useEffect(() => {
    hideConditionTooltip();
    setParticipateAmount("");
  }, []);

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
            balance: {currentGnsBalance || "-"}
          </span>
        </div>
      </div>

      <Divider />

      <div className="participate-info-wrapper">
        <div className="participate-info">
          <div className="participate-info-key">Pool Tier</div>
          <div className="participate-info-value">
            {poolInfo?.poolTier && (
              <LaunchpadPoolTierChip poolTier={poolInfo.poolTier} />
            )}
          </div>
        </div>
        <div className="participate-info">
          <div className="participate-info-key">
            Rewards Claimable On <IconInfo fill="#596782" size={16} />
          </div>
          <div className="participate-info-value">-</div>
        </div>
        <div className="participate-info">
          <div className="participate-info-key">
            End Date <IconInfo fill="#596782" size={16} />
          </div>
          <div className="participate-info-value">{poolInfo?.endTime}</div>
        </div>
        <div className="participate-info">
          <div className="participate-info-key">Deposit Amount</div>
          <div className="participate-info-value">
            {participateAmount || "-"}
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
          showConditionTooltip={showConditionTooltip}
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
  showConditionTooltip: () => void;
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
  showConditionTooltip,
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
        className="button-deposit"
        text={text}
        style={defaultStyle}
        onClick={showConditionTooltip}
      />
    );
  }
  return (
    <Button
      className="button-deposit"
      text={text}
      style={defaultStyle}
      onClick={openLaunchpadDepositAction}
    />
  );
};

export default LaunchpadParticipate;
