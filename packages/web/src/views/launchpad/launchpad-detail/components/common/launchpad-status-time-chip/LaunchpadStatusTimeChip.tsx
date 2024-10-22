import React from "react";

import { PROJECT_STATUS_TYPE } from "@common/values";
import { StatusTimeChipWrapper } from "./LaunchpadStatusTimeChip.styled";
import IconTimer from "@components/common/icons/IconTimer";

interface LaunchpadStatusTimeChipProps {
  startTime?: string;
  endTime?: string;
  status: PROJECT_STATUS_TYPE;
}

const LaunchpadStatusTimeChip = ({
  startTime,
  endTime,
  status,
}: LaunchpadStatusTimeChipProps) => {
  if (!startTime || !endTime) return <>-</>;

  const getStatusText = (type: PROJECT_STATUS_TYPE) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end < now) {
      return "Ended";
    }

    const getTimeDifference = (
      future: Date,
      now: Date,
    ): { days: number; hours: number } => {
      const diffMs = future.getTime() - now.getTime();
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      return { days, hours };
    };

    switch (type) {
      case PROJECT_STATUS_TYPE.UPCOMING:
        const { days: upcomingDays, hours: upcomingHours } = getTimeDifference(
          start,
          now,
        );
        return `Upcoming in ${upcomingDays} days ${upcomingHours} hours`;
      case PROJECT_STATUS_TYPE.ONGOING:
        const { days: ongoingDays, hours: ongoingHours } = getTimeDifference(
          end,
          now,
        );
        return `Ends in ${ongoingDays} days ${ongoingHours} hours`;
      case PROJECT_STATUS_TYPE.ENDED:
        return "Ended";
    }
  };

  const now = new Date();
  const end = new Date(endTime);
  const displayStatus = end < now ? PROJECT_STATUS_TYPE.ENDED : status;

  return (
    <StatusTimeChipWrapper type={displayStatus}>
      <IconTimer type={displayStatus} />
      <div>{getStatusText(displayStatus)}</div>
    </StatusTimeChipWrapper>
  );
};

export default LaunchpadStatusTimeChip;
