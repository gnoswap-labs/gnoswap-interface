import React from "react";

import { useLaunchpadHandler } from "@hooks/launchpad/use-launchpad-handler";

import { Divider } from "@components/common/divider/divider";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconInfo from "@components/common/icons/IconInfo";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import { GNOT_TOKEN } from "@common/values/token-constant";

import { LaunchpadParticipateWrapper } from "./LaunchpadParticipate.styles";

const DEFAULT_DEPOSIT_GNOT = GNOT_TOKEN;

const LaunchpadParticipate: React.FC = () => {
  const {
    connectedWallet,
    depositButtonText,
    openConnectWallet,
    isSwitchNetwork,
    switchNetwork,
    openLaunchpadDepositAction,
  } = useLaunchpadHandler();
  return (
    <LaunchpadParticipateWrapper>
      <div className="participate-header">Participate</div>

      <div className="participate-input-wrapper">
        <div className="participate-input-amount">
          <input className="participate-amount-text" placeholder="0" />
          <div className="participate-token-selector">
            <SelectPairButton
              token={DEFAULT_DEPOSIT_GNOT}
              isHiddenArrow
              disabled
            />
          </div>
        </div>

        <div className="participate-amount-info">
          <span className="participate-price-text">-</span>
          <span className="participate-balance-text">balance: -</span>
        </div>
      </div>

      <Divider />

      <div className="participate-info-wrapper">
        <div className="participate-info">
          <div className="participate-info-key">Pool Tier</div>
          <div className="participate-info-value">-</div>
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
          <div className="participate-info-value">-</div>
        </div>
        <div className="participate-info">
          <div className="participate-info-key">Deposit Amount</div>
          <div className="participate-info-value">-</div>
        </div>
      </div>

      <div className="participate-button-wrapper">
        <DepositButton
          isSwitchNetwork={isSwitchNetwork}
          connectedWallet={connectedWallet}
          text={depositButtonText}
          openConnectWallet={openConnectWallet}
          switchNetwork={switchNetwork}
          openLaunchpadDepositAction={openLaunchpadDepositAction}
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
