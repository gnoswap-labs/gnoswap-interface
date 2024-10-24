import React from "react";

import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { ParticipationSkeletonWrapper } from "./LaunchpadMyParticipationSkeleton.styles";

const LaunchpadMyParticipationSkeleton = () => {
  return (
    <ParticipationSkeletonWrapper>
      <LoadingSpinner />
    </ParticipationSkeletonWrapper>
  );
};

export default LaunchpadMyParticipationSkeleton;
