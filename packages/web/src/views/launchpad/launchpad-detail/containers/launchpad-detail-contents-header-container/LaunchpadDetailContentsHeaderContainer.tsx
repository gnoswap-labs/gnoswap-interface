import React from "react";

import { ProjectRewardInfoModel } from "../../LaunchpadDetail";

import LaunchpadDetailContentsHeader from "../../components/launchpad-detail-contents-header/LaunchpadDetailContentsHeader";

interface LaunchpadDetailContentsHeaderContainerProps {
  data: {
    name: string;
    projectStatus: string | null;
    startTime?: string;
    endTime?: string;
  };
  isLoading: boolean;
  rewardInfo: ProjectRewardInfoModel;
}

const LaunchpadDetailContentsHeaderContainer: React.FC<
  LaunchpadDetailContentsHeaderContainerProps
> = ({ data, isLoading, rewardInfo }) => {
  return (
    <LaunchpadDetailContentsHeader
      data={data}
      isLoading={isLoading}
      rewardInfo={rewardInfo}
    />
  );
};

export default LaunchpadDetailContentsHeaderContainer;
