/**
 * @yjin
 * Todo: Delete This code.
 * Change the image tag to a component.
 */
/* eslint-disable @next/next/no-img-element */
import React from "react";

import { ActiveProjectCardHeader } from "./LaunchpadActiveProjectCardHeader.styles";
import MissingLogo from "@components/common/missing-logo/MissingLogo";

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
        <div className="title">
          {name} (${rewardTokenSymbol})
        </div>
        <div className="text">{description}</div>
      </div>
      <div className="image-wrapper">
        <MissingLogo
          symbol={rewardTokenSymbol}
          url={rewardTokenUrl}
          width={60}
        />
      </div>
    </ActiveProjectCardHeader>
  );
};

export default LaunchpadActiveProjectCardHeader;
