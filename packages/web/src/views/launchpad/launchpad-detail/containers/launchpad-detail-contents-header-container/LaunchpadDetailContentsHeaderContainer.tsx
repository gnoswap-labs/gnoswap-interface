import React from "react";

import LaunchpadDetailContentsHeader from "../../components/launchpad-detail-contents-header/LaunchpadDetailContentsHeader";

interface LaunchpadDetailContentsHeaderContainerProps {
  data: { name: string; projectStatus: string | null };
}

const LaunchpadDetailContentsHeaderContainer: React.FC<
  LaunchpadDetailContentsHeaderContainerProps
> = ({ data }) => {
  return (
    <LaunchpadDetailContentsHeader
      projectName={data.name}
      projectStatus={data.projectStatus}
    />
  );
};

export default LaunchpadDetailContentsHeaderContainer;
