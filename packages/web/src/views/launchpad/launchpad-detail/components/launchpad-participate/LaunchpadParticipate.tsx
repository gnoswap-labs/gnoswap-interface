import React from "react";
import BigNumber from "bignumber.js";

import { useLaunchpadHandler } from "@hooks/launchpad/use-launchpad-handler";
import { useTokenData } from "@hooks/token/use-token-data";
import { isAmount } from "@common/utils/data-check-util";
import { LaunchpadPoolModel } from "@models/launchpad";
import { GNS_TOKEN } from "@common/values/token-constant";
import { useLaunchpadDepositConfirmModal } from "../../hooks/use-launchpad-deposit-confirm-modal";
import { ProjectRewardInfoModel } from "../../LaunchpadDetail";
import { convertToKMB } from "@utils/stake-position-utils";

import { Divider } from "@components/common/divider/divider";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconInfo from "@components/common/icons/IconInfo";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import { LaunchpadParticipateWrapper } from "./LaunchpadParticipate.styles";

const DEFAULT_DEPOSIT_TOKEN = GNS_TOKEN;

interface LaunchpadParticipateProps {
  poolInfo?: LaunchpadPoolModel;
  rewardInfo: ProjectRewardInfoModel;

  refetch: () => Promise<void>;
}

const LaunchpadParticipate: React.FC<LaunchpadParticipateProps> = ({
  poolInfo,
  rewardInfo,
  refetch,
}) => {
  const {
    connectedWallet,
    depositButtonText,
    openConnectWallet,
    isSwitchNetwork,
    switchNetwork,
  } = useLaunchpadHandler();
  const { tokenPrices, displayBalanceMap } = useTokenData();

  const [participateAmount, setParticipateAmount] = React.useState("");

  const onChangeParticipateAmount = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value !== "" && !isAmount(value)) return;
      setParticipateAmount(value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1"));
    },
    [],
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

  return (
    <LaunchpadParticipateWrapper>
      <div className="participate-header">Participate</div>

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
            {poolInfo?.poolTier || "-"}
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
          isSwitchNetwork={isSwitchNetwork}
          connectedWallet={connectedWallet}
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

  openConnectWallet: () => void;
  openLaunchpadDepositAction: () => void;
  switchNetwork: () => void;
}

const DepositButton: React.FC<DepositButtonProps> = ({
  connectedWallet,
  text,
  openConnectWallet,
  isSwitchNetwork,
  switchNetwork,
  openLaunchpadDepositAction,
}) => {
  const defaultStyle = {
    fullWidth: true,
    hierarchy: ButtonHierarchy.Primary,
  };

  if (!connectedWallet) {
    return (
      <Button text={text} style={defaultStyle} onClick={openConnectWallet} />
    );
  }

  if (isSwitchNetwork) {
    return <Button text={text} style={defaultStyle} onClick={switchNetwork} />;
  }

  return (
    <Button
      text={text}
      style={defaultStyle}
      onClick={openLaunchpadDepositAction}
    />
  );
};

export default LaunchpadParticipate;
