import React from "react";

import { useLaunchpadHandler } from "@hooks/launchpad/use-launchpad-handler";

import { MyParticipationWrapper } from "./LaunchpadMyParticipation.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { Divider } from "@components/common/divider/divider";
import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconArrowUp from "@components/common/icons/IconArrowUp";

const LaunchpadMyParticipation = () => {
  const [openedSelector, setOpenedSelector] = React.useState(false);

  const {
    openLaunchpadClaimAllAction,
    openLaunchpadWaitingConfirmationAction,
  } = useLaunchpadHandler();

  return (
    <MyParticipationWrapper>
      <div className="my-participation-header">
        <h3 className="my-participation-title">My Participation</h3>
        <div className="claim-all-button-wrapper">
          <ClaimAllButton openModal={openLaunchpadClaimAllAction} />
        </div>
      </div>

      <div className="my-participation-box">
        <div className="my-participation-box-header">
          <div className="participation-box-index">#1</div>
          <div className="participation-box-chip">1 Month</div>
        </div>

        <div className="participation-box-data-wrapper">
          <div className="participation-box-data">
            <div className="participation-box-data-key">Deposit Amounts</div>
            <div className="participation-box-data-value">123</div>
          </div>
          <div className="participation-box-data">
            <div className="participation-box-data-key">APR</div>
            <div className="participation-box-data-value">123</div>
          </div>
          <div className="participation-box-data">
            <div className="participation-box-data-key">Claimable</div>
            <div className="participation-box-data-value">123</div>
          </div>
          {openedSelector && (
            <>
              <div className="participation-box-data">
                <div className="participation-box-data-key">Claimable Date</div>
                <div className="participation-box-data-value">123</div>
              </div>
              <div className="participation-box-data">
                <div className="participation-box-data-key">Claimed</div>
                <div className="participation-box-data-value">123</div>
              </div>
              <div className="participation-box-data">
                <div className="participation-box-data-key">End Date</div>
                <div className="participation-box-data-value">123</div>
              </div>
              <div className="participation-box-button-wrapper">
                <ClaimButton
                  openModal={openLaunchpadWaitingConfirmationAction}
                />
              </div>
            </>
          )}
        </div>

        <Divider />

        <div
          className="box-accordion-button-wrapper"
          onClick={() => setOpenedSelector(prev => !prev)}
        >
          <div className="title">
            <div>Details</div>
            <div className="icon-wrapper">
              {openedSelector ? <IconArrowUp /> : <IconArrowDown />}
            </div>
          </div>
        </div>
      </div>
    </MyParticipationWrapper>
  );
};

interface ButtonProps {
  openModal: () => void;
}

const claimDefaultStyle = {
  fullWidth: true,
  hierarchy: ButtonHierarchy.Primary,
};

const ClaimAllButton: React.FC<ButtonProps> = ({ openModal }) => {
  return (
    <Button text="Claim All" style={claimDefaultStyle} onClick={openModal} />
  );
};

const ClaimButton: React.FC<ButtonProps> = ({ openModal }) => {
  return <Button text="Claim" style={claimDefaultStyle} onClick={openModal} />;
};

export default LaunchpadMyParticipation;
