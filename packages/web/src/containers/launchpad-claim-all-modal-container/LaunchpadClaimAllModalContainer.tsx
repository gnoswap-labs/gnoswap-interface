import React from "react";

import {
  LaunchpadParticipationModel,
  LaunchpadPoolModel,
} from "@models/launchpad";

import LaunchpadClaimAllModal from "@components/common/launchpad-modal/launchpad-claim-all-modal/LaunchpadClaimAllModal";

interface LaunchpadClaimAllModalContainerProps {
  poolInfos: LaunchpadPoolModel[];
  data: LaunchpadParticipationModel[];

  refetch: () => Promise<void>;
  close: () => void;
}

const LaunchpadClaimAllModalContainer = ({
  data,
  poolInfos,
  refetch,
  close,
}: LaunchpadClaimAllModalContainerProps) => {
  return (
    <LaunchpadClaimAllModal
      data={data}
      poolInfos={poolInfos}
      refetch={refetch}
      close={close}
    />
  );
};

export default LaunchpadClaimAllModalContainer;
