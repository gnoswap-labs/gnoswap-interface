import React from "react";

import { useLaunchpadHandler } from "@hooks/launchpad/use-launchpad-handler";
import {
  LaunchpadParticipationModel,
  LaunchpadPoolModel,
} from "@models/launchpad";
import { ProjectRewardInfoModel } from "../../LaunchpadDetail";

import { MyParticipationWrapper } from "./LaunchpadMyParticipation.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import LaunchpadMyParticipationBox from "./launchpad-my-participation-box/LaunchpadMyParticipationBox";
import { useLaunchpadClaimAllModal } from "../../hooks/use-launchpad-claim-all-modal";
import LaunchpadMyParticipationUnconnected from "./launchpad-my-participation-unconnected/LaunchpadMyParticipationUnconnected";
import LaunchpadMyParticipationNoData from "./launchpad-my-participation-no-data/LaunchpadMyParticipationNoData";
import { toNumberFormat } from "@utils/number-utils";

interface LaunchpadMyParticipationProps {
  poolInfos: LaunchpadPoolModel[];
  data: LaunchpadParticipationModel[];
  rewardInfo: ProjectRewardInfoModel;
  connected: boolean;
  isSwitchNetwork: boolean;
  isFetched: boolean;

  refetch: () => Promise<void>;
}

const LaunchpadMyParticipation = ({
  poolInfos,
  data,
  rewardInfo,
  connected,
  isSwitchNetwork,
  isFetched,
  refetch,
}: LaunchpadMyParticipationProps) => {
  const { claim } = useLaunchpadHandler();
  const { openLaunchpadClaimAllModal } = useLaunchpadClaimAllModal({
    data,
    rewardInfo,
    refetch,
  });

  const handleClickClaim = React.useCallback(
    (data: LaunchpadParticipationModel) => {
      claim(data, async () => {
        await refetch();
      });
    },
    [claim, refetch],
  );

  const handleClickClaimAll = React.useCallback(() => {
    openLaunchpadClaimAllModal();
  }, [openLaunchpadClaimAllModal]);

  const highestApr = React.useMemo(() => {
    return poolInfos.reduce((acc, current) => {
      if (Number(current.apr) > acc) {
        return Number(current.apr);
      }
      return acc;
    }, Number(poolInfos?.[0]?.apr ?? 0));
  }, [poolInfos]);

  const isShowClaimAllButton = React.useMemo(() => {
    const currentTime = new Date();
    return data.some(item => {
      const claimableTime = new Date(item.claimableTime);

      if (currentTime <= claimableTime) return false;

      const isClaimedReward =
        Number(toNumberFormat(item.claimableRewardAmount, 2)) === 0;
      const isClaimedDeposit = Number(toNumberFormat(item.depositAmount)) === 0;
      const isClaimed = isClaimedReward && isClaimedDeposit;

      return !isClaimed;
    });
  }, [data]);

  // Conditional rendering
  if (!connected || isSwitchNetwork) {
    return (
      <MyParticipationWrapper>
        <div className="my-participation-header">
          <h3 className="my-participation-title">My Participation</h3>
        </div>
        <LaunchpadMyParticipationUnconnected />
      </MyParticipationWrapper>
    );
  }

  if (connected && isFetched && data.length === 0) {
    return (
      <MyParticipationWrapper>
        <div className="my-participation-header">
          <h3 className="my-participation-title">My Participation</h3>
        </div>
        <LaunchpadMyParticipationNoData highestApr={highestApr} />
      </MyParticipationWrapper>
    );
  }

  return (
    <MyParticipationWrapper>
      <div className="my-participation-header">
        <h3 className="my-participation-title">My Participation</h3>
        {isShowClaimAllButton && (
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
            rewardInfo={rewardInfo}
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
  disabled?: boolean;
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
