import React from "react";

import { ProjectRewardInfoModel } from "@views/launchpad/launchpad-detail/LaunchpadDetail";
import { LaunchpadParticipationModel } from "@models/launchpad";

import LaunchpadClaimAllModal from "@components/common/launchpad-modal/launchpad-claim-all-modal/LaunchpadClaimAllModal";

interface LaunchpadClaimAllModalContainerProps {
  data: LaunchpadParticipationModel[];
  rewardInfo: ProjectRewardInfoModel;

  refetch: () => Promise<void>;
  close: () => void;
}

const LaunchpadClaimAllModalContainer = ({
  data,
  rewardInfo,
  refetch,
  close,
}: LaunchpadClaimAllModalContainerProps) => {
  return (
    <LaunchpadClaimAllModal
      data={data}
      rewardInfo={rewardInfo}
      refetch={refetch}
      close={close}
    />
  );
};

export default LaunchpadClaimAllModalContainer;
