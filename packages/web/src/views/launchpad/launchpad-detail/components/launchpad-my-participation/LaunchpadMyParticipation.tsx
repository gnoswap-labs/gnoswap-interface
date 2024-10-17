import React from "react";

import { useLaunchpadHandler } from "@hooks/launchpad/use-launchpad-handler";
import { LaunchpadParticipationModel } from "@models/launchpad";

import { MyParticipationWrapper } from "./LaunchpadMyParticipation.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import LaunchpadMyParticipationBox from "./launchpad-my-participation-box/LaunchpadMyParticipationBox";

interface LaunchpadMyParticipationProps {
  data: LaunchpadParticipationModel[];
}

const LaunchpadMyParticipation = ({ data }: LaunchpadMyParticipationProps) => {
  const { claim, claimAll } = useLaunchpadHandler();

  const handleClickClaim = React.useCallback(
    (data: LaunchpadParticipationModel) => {
      claim(data, async () => {
        console.log("end");
      });
    },
    [claim],
  );

  const handleClickClaimAll = React.useCallback(() => {
    claimAll(data, async () => {
      console.log("end Claim All");
    });
  }, [claimAll]);

  return (
    <MyParticipationWrapper>
      <div className="my-participation-header">
        <h3 className="my-participation-title">My Participation</h3>
        <div className="claim-all-button-wrapper">
          <ClaimAllButton onClick={handleClickClaimAll} />
        </div>
      </div>

      {data?.map((item, idx) => {
        return (
          <LaunchpadMyParticipationBox
            key={item.id}
            item={item}
            idx={idx + 1}
            handleClickClaim={handleClickClaim}
          />
        );
      })}
    </MyParticipationWrapper>
  );
};

export interface ParticipateButtonProps {
  onClick: () => void;
}

const ClaimAllButton: React.FC<ParticipateButtonProps> = ({ onClick }) => {
  const claimDefaultStyle = {
    fullWidth: true,
    hierarchy: ButtonHierarchy.Primary,
  };

  return (
    <Button text="Claim All" style={claimDefaultStyle} onClick={onClick} />
  );
};

export default LaunchpadMyParticipation;
