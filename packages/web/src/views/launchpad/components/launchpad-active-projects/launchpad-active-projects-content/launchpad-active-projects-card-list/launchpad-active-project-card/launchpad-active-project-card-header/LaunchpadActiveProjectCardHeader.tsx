/**
 * @yjin
 * Todo: Delete This code.
 * Change the image tag to a component.
 */
/* eslint-disable @next/next/no-img-element */
import React from "react";

import { ActiveProjectCardHeader } from "./LaunchpadActiveProjectCardHeader.styles";

interface LaunchpadActiveProjectCardHeaderProps {
  projectId: string;
  name: string;
}

const LaunchpadActiveProjectCardHeader: React.FC<
  LaunchpadActiveProjectCardHeaderProps
> = ({ projectId, name }) => {
  return (
    <ActiveProjectCardHeader>
      <div className="header-title-wrapper">
        <div className="title">{projectId}</div>
        <div className="text">{name}</div>
      </div>
      <div className="image-wrapper">
        <img src="/gns.svg" alt="Token symbol image" />
      </div>
    </ActiveProjectCardHeader>
  );
};

export default LaunchpadActiveProjectCardHeader;
