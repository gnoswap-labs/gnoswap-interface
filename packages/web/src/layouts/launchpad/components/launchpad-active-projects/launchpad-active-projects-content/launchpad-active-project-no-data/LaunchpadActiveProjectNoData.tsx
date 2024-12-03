import React from "react";
import {
  ActiveProjectsCardListWrapper,
  ActiveProjectsGridWrapper,
  BlankProjectCard,
} from "../launchpad-active-projects-card-list/LaunchpadActiveProjectsCardList.styles";

const LaunchpadActiveProjectNoData = () => {
  return (
    <ActiveProjectsCardListWrapper>
      <ActiveProjectsGridWrapper>
        {Array.from({ length: 4 }).map((_, idx) => {
          return <BlankProjectCard key={idx} />;
        })}
      </ActiveProjectsGridWrapper>
    </ActiveProjectsCardListWrapper>
  );
};

export default LaunchpadActiveProjectNoData;
