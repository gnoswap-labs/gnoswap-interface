import React from "react";

import { useLaunchpadHandler } from "@hooks/launchpad/use-launchpad-handler";
import {
  LaunchpadParticipationModel,
  LaunchpadPoolModel,
} from "@models/launchpad";

import { MyParticipationWrapper } from "./LaunchpadMyParticipation.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import LaunchpadMyParticipationBox from "./launchpad-my-participation-box/LaunchpadMyParticipationBox";
import { useLaunchpadClaimAllModal } from "../../hooks/use-launchpad-claim-all-modal";

interface LaunchpadMyParticipationProps {
  poolInfos: LaunchpadPoolModel[];
  data: LaunchpadParticipationModel[];

  refetch: () => Promise<void>;
}

const LaunchpadMyParticipation = ({
  poolInfos,
  data,
  refetch,
}: LaunchpadMyParticipationProps) => {
  const { claim } = useLaunchpadHandler();
  const { openLaunchpadClaimAllModal } = useLaunchpadClaimAllModal({
    data,
    poolInfos,
    refetch,
  });

  const handleClickClaim = React.useCallback(
    (data: LaunchpadParticipationModel) => {
      claim(data, async () => {
        console.log("end");
      });
    },
    [claim],
  );

  const handleClickClaimAll = React.useCallback(() => {
    openLaunchpadClaimAllModal();
  }, [data, openLaunchpadClaimAllModal]);

  return (
    <MyParticipationWrapper>
      <div className="my-participation-header">
        <h3 className="my-participation-title">My Participation</h3>
        {data.length > 0 && (
          <div className="claim-all-button-wrapper">
            <ClaimAllButton onClick={handleClickClaimAll} />
          </div>
        )}
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
