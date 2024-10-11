import React from "react";

import { LaunchpadProjectResponse } from "@repositories/launchpad/response";

import LaunchpadActiveProjectCard from "./launchpad-active-project-card/LaunchpadActiveProjectCard";
import {
  ActiveProjectsCardListWrapper,
  ActiveProjectsGridWrapper,
} from "./LaunchpadActiveProjectsCardList.styles";

interface LaunchpadActiveProjectsCardListProps {
  activeProjectList: LaunchpadProjectResponse[];
}

const LaunchpadActiveProjectsCardList: React.FC<
  LaunchpadActiveProjectsCardListProps
> = ({ activeProjectList }) => {
  return (
    <ActiveProjectsCardListWrapper>
      <ActiveProjectsGridWrapper>
        {activeProjectList && activeProjectList.length > 0 && (
          <>
            {activeProjectList.map(
              (activeProjectDetail: LaunchpadProjectResponse) => {
                return (
                  <LaunchpadActiveProjectCard
                    key={activeProjectDetail.id}
                    activeProjectDetail={activeProjectDetail}
                  />
                );
              },
            )}
          </>
        )}
      </ActiveProjectsGridWrapper>
    </ActiveProjectsCardListWrapper>
  );
};

export default LaunchpadActiveProjectsCardList;
