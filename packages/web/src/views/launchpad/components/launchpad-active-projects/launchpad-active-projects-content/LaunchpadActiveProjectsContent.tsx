import React from "react";

import { LaunchpadProjectResponse } from "@repositories/launchpad/response";

import LaunchpadActiveProjectsCardList from "./launchpad-active-projects-card-list/LaunchpadActiveProjectsCardList";

export interface LaunchpadActiveProjectsContentProps {
  activeProjectList: LaunchpadProjectResponse[];
}

const LaunchpadActiveProjectsContent: React.FC<
  LaunchpadActiveProjectsContentProps
> = ({ activeProjectList }) => {
  return (
    <LaunchpadActiveProjectsCardList activeProjectList={activeProjectList} />
  );
};

export default LaunchpadActiveProjectsContent;
