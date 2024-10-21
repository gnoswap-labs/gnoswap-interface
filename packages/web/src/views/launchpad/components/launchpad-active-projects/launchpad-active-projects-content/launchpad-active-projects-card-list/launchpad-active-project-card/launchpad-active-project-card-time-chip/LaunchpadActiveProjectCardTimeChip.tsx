import React from "react";

import IconTimer from "@components/common/icons/IconTimer";

import { ActiveProjectCardTimeChip } from "./LaunchpadActiveProjectCardTimeChip.styles";
import { PROJECT_STATUS_TYPE } from "@common/values";

interface LaunchpadActiveProjectCardTimeChipProps {
  type: PROJECT_STATUS_TYPE;
  startTime: string;
  endTime: string;
}

const LaunchpadActiveProjectCardTimeChip: React.FC<
  LaunchpadActiveProjectCardTimeChipProps
> = ({ type = PROJECT_STATUS_TYPE.UPCOMING, startTime, endTime }) => {
  const getStatusText = (type: PROJECT_STATUS_TYPE) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

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
  return (
    <ActiveProjectCardTimeChip type={type}>
      <IconTimer type={type} />
      <div>{getStatusText(type)}</div>
    </ActiveProjectCardTimeChip>
  );
};

export default LaunchpadActiveProjectCardTimeChip;
