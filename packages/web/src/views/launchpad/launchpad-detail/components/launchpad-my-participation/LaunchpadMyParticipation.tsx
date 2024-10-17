import React from "react";

import { useLaunchpadHandler } from "@hooks/launchpad/use-launchpad-handler";
import { LaunchpadParticipationModel } from "@models/launchpad";

import { MyParticipationWrapper } from "./LaunchpadMyParticipation.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { Divider } from "@components/common/divider/divider";
import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconArrowUp from "@components/common/icons/IconArrowUp";

interface LaunchpadMyParticipationProps {
  data: LaunchpadParticipationModel[];
}

const LaunchpadMyParticipation = ({ data }: LaunchpadMyParticipationProps) => {
  const [openedSelector, setOpenedSelector] = React.useState(false);

  const {
    openLaunchpadClaimAllAction,
    openLaunchpadWaitingConfirmationAction,
    claim,
  } = useLaunchpadHandler();

  const onClickClaim = React.useCallback(
    (data: LaunchpadParticipationModel) => {
      claim(data, async () => {
        console.log("end");
      });
    },
    [data, claim],
  );

  return (
    <MyParticipationWrapper>
      <div className="my-participation-header">
        <h3 className="my-participation-title">My Participation</h3>
        <div className="claim-all-button-wrapper">
          <ClaimAllButton openModal={openLaunchpadClaimAllAction} />
        </div>
      </div>

      {data?.map(item => {
        return (
          <div className="my-participation-box" key={item.id}>
            <div className="my-participation-box-header">
              <div className="participation-box-index">#{item.id}</div>
              <div className="participation-box-chip">{item.poolTier}</div>
            </div>

            <div className="participation-box-data-wrapper">
              <div className="participation-box-data">
                <div className="participation-box-data-key">
                  Deposit Amounts
                </div>
                <div className="participation-box-data-value">
                  {item.depositAmount}
                </div>
              </div>
              <div className="participation-box-data">
                <div className="participation-box-data-key">APR</div>
                <div className="participation-box-data-value">
                  {item.depositAPR}
                </div>
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
                    <div className="participation-box-data-key">
                      Claimable Date
                    </div>
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
                    <div className="participation-box-data-value">
                      {item.endTime}
                    </div>
                  </div>
                  <div className="participation-box-button-wrapper">
                    <ClaimButton
                      openModal={openLaunchpadWaitingConfirmationAction}
                      onClick={() => onClickClaim(item)}
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
        );
      })}
    </MyParticipationWrapper>
  );
};

interface ButtonProps {
  openModal: () => void;
  onClick?: () => void;
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

const ClaimButton: React.FC<ButtonProps> = ({ onClick }) => {
  return <Button text="Claim" style={claimDefaultStyle} onClick={onClick} />;
};

export default LaunchpadMyParticipation;
