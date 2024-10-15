import React from "react";

import { useLaunchpadHandler } from "@hooks/launchpad/use-launchpad-handler";

import { MyParticipationWrapper } from "./LaunchpadMyParticipation.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { Divider } from "@components/common/divider/divider";
import IconArrowDown from "@components/common/icons/IconArrowDown";

const LaunchpadMyParticipation = () => {
  const { openLaunchpadClaimAllAction } = useLaunchpadHandler();
  return (
    <MyParticipationWrapper>
      <div className="my-participation-header">
        <h3 className="my-participation-title">My Participation</h3>
        <div className="claim-all-button-wrapper">
          <ClaimAllButton
            openLaunchpadClaimAllAction={openLaunchpadClaimAllAction}
          />
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
        </div>

        <div className="participation-box-button-wrapper">
          <ClaimButton />
        </div>

        <Divider />

        <div className="box-accordion-button-wrapper">
          <button>
            Details <IconArrowDown fill="#90A2C0" />
          </button>
        </div>
      </div>
    </MyParticipationWrapper>
  );
};

interface ClaimAllButtonProps {
  openLaunchpadClaimAllAction: () => void;
}

const claimDefaultStyle = {
  fullWidth: true,
  hierarchy: ButtonHierarchy.Primary,
};

const ClaimAllButton: React.FC<ClaimAllButtonProps> = ({
  openLaunchpadClaimAllAction,
}) => {
  return (
    <Button
      text="Claim All"
      style={claimDefaultStyle}
      onClick={openLaunchpadClaimAllAction}
    />
  );
};

const ClaimButton = () => {
  return <Button text="Claim" style={claimDefaultStyle} />;
};

export default LaunchpadMyParticipation;
