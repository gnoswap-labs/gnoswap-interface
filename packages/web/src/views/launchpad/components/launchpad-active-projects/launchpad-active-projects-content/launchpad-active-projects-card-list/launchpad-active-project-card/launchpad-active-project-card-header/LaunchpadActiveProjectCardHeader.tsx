/**
 * @yjin
 * Todo: Delete This code.
 * Change the image tag to a component.
 */
/* eslint-disable @next/next/no-img-element */
import React from "react";

import { ActiveProjectCardHeader } from "./LaunchpadActiveProjectCardHeader.styles";

interface LaunchpadActiveProjectCardHeaderProps {
  name: string;
  description: string;
  rewardTokenSymbol: string;
  rewardTokenUrl: string;
}

const LaunchpadActiveProjectCardHeader: React.FC<
  LaunchpadActiveProjectCardHeaderProps
> = ({ name, description, rewardTokenSymbol, rewardTokenUrl }) => {
  return (
    <ActiveProjectCardHeader>
      <div className="header-title-wrapper">
        <div className="title">{name}</div>
        <div className="text">{description}</div>
      </div>
      <div className="image-wrapper">
        <img src={rewardTokenUrl} alt={`${rewardTokenSymbol} symbol image`} />
      </div>
    </ActiveProjectCardHeader>
  );
};

export default LaunchpadActiveProjectCardHeader;
