import React from "react";

import LaunchpadActiveProjectCard from "./launchpad-active-project-card/LaunchpadActiveProjectCard";
import {
  ActiveProjectsCardListWrapper,
  ActiveProjectsGridWrapper,
} from "./LaunchpadActiveProjectsCardList.styles";

/**
 * @yjin
 * The interface will be modified to reflect real data.
 */
// interface LaunchpadActiveProjectsCardListProps {}

const LaunchpadActiveProjectsCardList: React.FC = () => {
  return (
    <ActiveProjectsCardListWrapper>
      <ActiveProjectsGridWrapper>
        <LaunchpadActiveProjectCard />
        <LaunchpadActiveProjectCard />
        <LaunchpadActiveProjectCard />
        <LaunchpadActiveProjectCard />
      </ActiveProjectsGridWrapper>
    </ActiveProjectsCardListWrapper>
  );
};

export default LaunchpadActiveProjectsCardList;
