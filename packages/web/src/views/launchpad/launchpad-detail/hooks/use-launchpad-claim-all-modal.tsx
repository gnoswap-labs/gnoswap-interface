import React from "react";
import { useAtom } from "jotai";

import { LaunchpadParticipationModel } from "@models/launchpad";
import { CommonState } from "@states/index";
import { ProjectRewardInfoModel } from "../LaunchpadDetail";

import LaunchpadClaimAllModalContainer from "@containers/launchpad-claim-all-modal-container/LaunchpadClaimAllModalContainer";

interface LaunchpadClaimAllModalProps {
  data: LaunchpadParticipationModel[];
  rewardInfo: ProjectRewardInfoModel;

  refetch: () => Promise<void>;
}

export const useLaunchpadClaimAllModal = ({
  data,
  rewardInfo,
  refetch,
}: LaunchpadClaimAllModalProps) => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  // Todo : React.useCallback
  const openLaunchpadClaimAllModal = () => {
    setOpenedModal(true);
    setModalContent(
      <LaunchpadClaimAllModalContainer
        data={data}
        rewardInfo={rewardInfo}
        refetch={refetch}
        close={close}
      />,
    );
  };

  const close = React.useCallback(() => {
    setOpenedModal(false);
    setModalContent(null);
  }, [setModalContent, setOpenedModal]);

  return { openLaunchpadClaimAllModal };
};
