import React from "react";
import {
  ActiveProjectsCardListWrapper,
  ActiveProjectsGridWrapper,
} from "../launchpad-active-projects-card-list/LaunchpadActiveProjectsCardList.styles";

const LaunchpadActiveProjectNoData = () => {
  return (
    <ActiveProjectsCardListWrapper>
      <ActiveProjectsGridWrapper>
        {Array.from({ length: 4 }).map((_, idx) => {
          return <div key={idx} className="nodata-card" />;
        })}
      </ActiveProjectsGridWrapper>
    </ActiveProjectsCardListWrapper>
  );
};

export default LaunchpadActiveProjectNoData;
