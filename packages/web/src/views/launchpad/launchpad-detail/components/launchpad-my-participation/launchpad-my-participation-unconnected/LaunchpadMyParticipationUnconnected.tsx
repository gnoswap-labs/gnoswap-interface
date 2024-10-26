import IconLinkOff from "@components/common/icons/IconLinkOff";
import React from "react";
import { UnconnectedWrapper } from "./LaunchpadMyParticipationUnconnected.styles";

const LaunchpadMyParticipationUnconnected = () => {
  return (
    <UnconnectedWrapper>
      <div className="unconnected-icon-wrapper">
        <IconLinkOff className="unconnected-icon" />
      </div>
      <div className="unconnected-text">
        Please connect your wallet <br />
        to view your participation.
      </div>
    </UnconnectedWrapper>
  );
};

export default LaunchpadMyParticipationUnconnected;
