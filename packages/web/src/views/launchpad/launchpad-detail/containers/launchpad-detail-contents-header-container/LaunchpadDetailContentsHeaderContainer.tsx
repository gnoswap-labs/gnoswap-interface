import React from "react";

import { ProjectRewardInfoModel } from "../../LaunchpadDetail";

import LaunchpadDetailContentsHeader from "../../components/launchpad-detail-contents-header/LaunchpadDetailContentsHeader";

interface LaunchpadDetailContentsHeaderContainerProps {
  data: { name: string; projectStatus: string | null };
  rewardInfo: ProjectRewardInfoModel;
}

const LaunchpadDetailContentsHeaderContainer: React.FC<
  LaunchpadDetailContentsHeaderContainerProps
> = ({ data, rewardInfo }) => {
  return <LaunchpadDetailContentsHeader data={data} rewardInfo={rewardInfo} />;
};

export default LaunchpadDetailContentsHeaderContainer;
