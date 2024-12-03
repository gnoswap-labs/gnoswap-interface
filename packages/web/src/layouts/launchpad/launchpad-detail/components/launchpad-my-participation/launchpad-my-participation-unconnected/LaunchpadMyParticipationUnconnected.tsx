import React from "react";
import { Trans } from "react-i18next";

import IconLinkOff from "@components/common/icons/IconLinkOff";
import { UnconnectedWrapper } from "./LaunchpadMyParticipationUnconnected.styles";

const LaunchpadMyParticipationUnconnected = () => {
  return (
    <UnconnectedWrapper>
      <div className="unconnected-icon-wrapper">
        <IconLinkOff className="unconnected-icon" />
      </div>
      <div className="unconnected-text">
        <Trans ns="Launchpad" i18nKey="myParticipation.unconnect">
          Please connect your wallet <br />
          to view your participation.
        </Trans>
      </div>
    </UnconnectedWrapper>
  );
};

export default LaunchpadMyParticipationUnconnected;
