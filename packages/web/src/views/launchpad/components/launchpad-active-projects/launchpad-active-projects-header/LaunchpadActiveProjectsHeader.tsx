import React from "react";
import {
  ActiveProjectsHeaderTextWrapper,
  ActiveProjectsWrapper,
} from "./LaunchpadActiveProjectsHeader.styles";

export interface LaunchpadActiveProjectsHeaderProps {
  count: number;
}

const LaunchpadActiveProjectsHeader: React.FC<
  LaunchpadActiveProjectsHeaderProps
> = ({ count }) => {
  const renderActiveProjectsTitle = () => {
    return (
      <>
        <span>Active Projects</span>
        <span className="value">{count}</span>
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
