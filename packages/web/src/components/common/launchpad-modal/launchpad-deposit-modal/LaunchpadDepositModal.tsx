import React from "react";

import { LaunchpadDepositModalWrapper } from "./LaunchpadDepositModal.styles";
import IconClose from "@components/common/icons/IconCancel";
import IconWarning from "../../icons/IconWarning";
import IconOpenLink from "../../icons/IconOpenLink";
import Button, { ButtonHierarchy } from "../../button/Button";
import { LaunchpadPoolModel } from "@models/launchpad";
import { useLaunchpadHandler } from "@hooks/launchpad/use-launchpad-handler";

interface LaunchpadDepositModalProps {
  depositAmount: string;
  poolInfo?: LaunchpadPoolModel;
  projectPath: string;

  refetch: () => Promise<void>;
}

const LaunchpadDepositModal = ({
  depositAmount,
  poolInfo,
  projectPath,
  refetch,
}: LaunchpadDepositModalProps) => {
  const { deposit } = useLaunchpadHandler();

  const confirm = React.useCallback(() => {
    deposit(`${projectPath}:30`, depositAmount, refetch);
  }, [projectPath, depositAmount, refetch]);
  return (
    <LaunchpadDepositModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>Confirm Deposit</h6>
          <div className="close-wrap">
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
          <div className="data">
            <div className="data-header">Deposit Detail</div>
            <div className="data-box">
              <div className="data-row">
                <div className="key">Deposit Amount</div>
                <div className="value">{depositAmount}</div>
              </div>
              <div className="data-row">
                <div className="key">Pool Tier</div>
                <div className="value">{poolInfo?.poolTier}</div>
              </div>
              <div className="data-row">
                <div className="key">End Date</div>
                <div className="value">{poolInfo?.endTime}</div>
              </div>
            </div>
          </div>
          <div className="data">
            <div className="data-header">Rewards Detail</div>
            <div className="data-box">
              <div className="data-row">
                <div className="key">Rewards Token</div>
                <div className="value"></div>
              </div>
              <div className="data-row">
                <div className="key">Network</div>
                <div className="value">123</div>
              </div>
              <div className="data-row">
                <div className="key">Rewards Claimable On</div>
                <div className="value">123</div>
              </div>
            </div>
          </div>

          <div className="note">
            <div className="header">
              <IconWarning /> Important Notes
            </div>
            <ul className="contents">
              <li className="list">
                Double-check to confirm that your deposit amount.
              </li>
              <li className="list">
                Only send supported tokens to this deposit address. <br />
                Depositing any other cryptocurrencies to this <br />
                launchpad will result in the loss of your funds.
              </li>
            </ul>
            <div className="learn-more">
              Learn More <IconOpenLink size="16" fill="#ff9f0a" />
            </div>
          </div>
        </div>
        <div className="footer">
          <ConfirmButton onClick={confirm} />
        </div>
      </div>
    </LaunchpadDepositModalWrapper>
  );
};

const ConfirmButton = ({ onClick }: { onClick: () => void }) => {
  const defaultStyle = {
    fullWidth: true,
    hierarchy: ButtonHierarchy.Primary,
  };
  return <Button text="Confirm" style={defaultStyle} onClick={onClick} />;
};

export default LaunchpadDepositModal;
