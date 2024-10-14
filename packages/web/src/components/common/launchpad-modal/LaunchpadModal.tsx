import React from "react";

import { LaunchpadModalWrapper } from "./LaunchpadModal.styles";
import IconClose from "../icons/IconCancel";
import IconWarning from "../icons/IconWarning";
import IconOpenLink from "../icons/IconOpenLink";
import Button, { ButtonHierarchy } from "../button/Button";

const LaunchpadModal = () => {
  return (
    <LaunchpadModalWrapper>
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
                <div className="value">123</div>
              </div>
              <div className="data-row">
                <div className="key">Pool Tier</div>
                <div className="value">123</div>
              </div>
              <div className="data-row">
                <div className="key">End Date</div>
                <div className="value">123</div>
              </div>
            </div>
          </div>
          <div className="data">
            <div className="data-header">Rewards Detail</div>
            <div className="data-box">
              <div className="data-row">
                <div className="key">Rewards Token</div>
                <div className="value">123</div>
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
          <ConfirmButton />
        </div>
      </div>
    </LaunchpadModalWrapper>
  );
};

const ConfirmButton = () => {
  const defaultStyle = {
    fullWidth: true,
    hierarchy: ButtonHierarchy.Primary,
  };
  return <Button text="Confirm" style={defaultStyle} />;
};

export default LaunchpadModal;
