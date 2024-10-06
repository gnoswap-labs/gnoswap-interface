/**
 * @yjin
 * Todo: Delete This code.
 * Change the image tag to a component.
 */
/* eslint-disable @next/next/no-img-element */
import React from "react";

import { ActiveProjectCardHeader } from "./LaunchpadActiveProjectCardHeader.styles";

const LaunchpadActiveProjectCardHeader = () => {
  return (
    <ActiveProjectCardHeader>
      <div className="header-title-wrapper">
        <div className="title">GnoSwap ($GNS)</div>
        <div className="text">GnoSwap ($GNS)</div>
      </div>
      <div className="image-wrapper">
        <img src="/gns.svg" alt="Token symbol image" />
      </div>
    </ActiveProjectCardHeader>
  );
};

export default LaunchpadActiveProjectCardHeader;
