import React from "react";

import { LaunchpadParticipationModel } from "@models/launchpad";

import LaunchpadMyParticipation from "../../components/launchpad-my-participation/LaunchpadMyParticipation";

interface LaunchpadMyParticipationContainerProps {
  data: LaunchpadParticipationModel[];
}

const LaunchpadMyParticipationContainer = ({
  data,
}: LaunchpadMyParticipationContainerProps) => {
  return <LaunchpadMyParticipation data={data} />;
};

export default LaunchpadMyParticipationContainer;
