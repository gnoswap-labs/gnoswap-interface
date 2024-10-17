import React from "react";

import { LaunchpadParticipationModel } from "@models/launchpad";
import { ParticipateButtonProps } from "../LaunchpadMyParticipation";

import { Divider } from "@components/common/divider/divider";
import IconArrowUp from "@components/common/icons/IconArrowUp";
import IconArrowDown from "@components/common/icons/IconArrowDown";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { MyParticipationBoxWrapper } from "./LaunchpadMyParticipationBox.styles";

interface LaunchpadMyParticipationBoxProps {
  item: LaunchpadParticipationModel;
  idx: number;

  handleClickClaim: (data: LaunchpadParticipationModel) => void;
}

const LaunchpadMyParticipationBox = ({
  item,
  idx,
  handleClickClaim,
}: LaunchpadMyParticipationBoxProps) => {
  const [openedSelector, setOpenedSelector] = React.useState(false);

  return (
    <MyParticipationBoxWrapper key={item.id}>
      <div className="my-participation-box-header">
        <div className="participation-box-index">#{idx}</div>
        <div className="participation-box-chip">{item.poolTier}</div>
      </div>

      <div className="participation-box-data-wrapper">
        <div className="participation-box-data">
          <div className="participation-box-data-key">Deposit Amounts</div>
          <div className="participation-box-data-value">
            {item.depositAmount}
          </div>
        </div>
        <div className="participation-box-data">
          <div className="participation-box-data-key">APR</div>
          <div className="participation-box-data-value">{item.depositAPR}</div>
        </div>
        <div className="participation-box-data">
          <div className="participation-box-data-key">Claimable</div>
          <div className="participation-box-data-value">
            {item.claimableRewardAmount}
          </div>
        </div>
        {openedSelector && (
          <>
            <div className="participation-box-data">
              <div className="participation-box-data-key">Claimable Date</div>
              <div className="participation-box-data-value">
                {item.claimableTime}
              </div>
            </div>
            <div className="participation-box-data">
              <div className="participation-box-data-key">Claimed</div>
              <div className="participation-box-data-value">
                {item.claimedRewardAmount}
              </div>
            </div>
            <div className="participation-box-data">
              <div className="participation-box-data-key">End Date</div>
              <div className="participation-box-data-value">{item.endTime}</div>
            </div>
            <div className="participation-box-button-wrapper">
              <ClaimButton onClick={() => handleClickClaim(item)} />
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
    </MyParticipationBoxWrapper>
  );
};

export const ClaimButton: React.FC<ParticipateButtonProps> = ({ onClick }) => {
  const claimDefaultStyle = {
    fullWidth: true,
    hierarchy: ButtonHierarchy.Primary,
  };

  return <Button text="Claim" style={claimDefaultStyle} onClick={onClick} />;
};

export default LaunchpadMyParticipationBox;
