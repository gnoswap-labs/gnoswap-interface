import Image from "next/image";
import React from "react";

import { ParticipationNoDataWrapper } from "./LaunchpadMyParticipationNoData.styles";

interface LaunchpadMyParticipationNoDataProps {
  highestApr: number;
}

const LaunchpadMyParticipationNoData = ({
  highestApr,
}: LaunchpadMyParticipationNoDataProps) => {
  return (
    <ParticipationNoDataWrapper>
      <Image
        src={"/gnoscan-banner-logo.png"}
        width={70}
        height={85}
        style={{ objectFit: "cover", marginLeft: "-18px" }}
        alt="gnoscan banner logo"
      />
      <div className="banner-text">
        <div className="banner-text-description">
          Deposit <span>GNS</span>
        </div>
        <div className="banner-text-description">now to earn up to</div>
        <div className="banner-text-description">
          <span>{highestApr || 0} APR</span>
        </div>
      </div>
    </ParticipationNoDataWrapper>
  );
};

export default LaunchpadMyParticipationNoData;
