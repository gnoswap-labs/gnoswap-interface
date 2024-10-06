import React from "react";
import {
  ActiveProjectsHeaderTextWrapper,
  ActiveProjectsWrapper,
} from "./LaunchpadActiveProjectsHeader.styles";

/**
 * @yjin
 * The interface will be modified to reflect real data.
 */
// export interface LaunchpadActiveProjectsHeaderProps {}

const LaunchpadActiveProjectsHeader: React.FC = () => {
  const renderActiveProjectsTitle = () => {
    return (
      <>
        <span>Active Projects</span>
        <span className="value">4</span>
      </>
    );
  };
  return (
    <ActiveProjectsWrapper>
      <div className="header-content">
        <ActiveProjectsHeaderTextWrapper>
          <div className="launchpad-active-projects-title-wrapper">
            {renderActiveProjectsTitle()}
          </div>
        </ActiveProjectsHeaderTextWrapper>
      </div>
    </ActiveProjectsWrapper>
  );
};

export default LaunchpadActiveProjectsHeader;
