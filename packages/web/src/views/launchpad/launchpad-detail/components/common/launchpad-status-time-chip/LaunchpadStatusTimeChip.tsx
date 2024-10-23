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
    ): { days: number; hours: number; minutes: number } => {
      const diffMs = future.getTime() - now.getTime();
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return { days, hours, minutes };
    };

    const formatTime = (days: number, hours: number, minutes: number) => {
      if (days > 0) {
        return `in ${days} days ${hours} hours`;
      } else if (hours > 0) {
        return `in ${hours} hours ${minutes} minutes`;
      } else if (minutes > 0) {
        return `in ${minutes} minutes`;
      } else {
        return "";
      }
    };

    switch (type) {
      case PROJECT_STATUS_TYPE.UPCOMING:
        const {
          days: upcomingDays,
          hours: upcomingHours,
          minutes: upcomingMinutes,
        } = getTimeDifference(start, now);
        return `Upcoming ${formatTime(
          upcomingDays,
          upcomingHours,
          upcomingMinutes,
        )}`;
      case PROJECT_STATUS_TYPE.ONGOING:
        const {
          days: ongoingDays,
          hours: ongoingHours,
          minutes: ongoingMinutes,
        } = getTimeDifference(end, now);
        if (ongoingDays < 0 && ongoingHours < 0 && ongoingMinutes < 0) {
          return "Ends in 1 minute";
        }
        return `Ends ${formatTime(ongoingDays, ongoingHours, ongoingMinutes)}`;
      case PROJECT_STATUS_TYPE.ENDED:
        return "Ended";
    }
  };

  return (
    <StatusTimeChipWrapper type={status}>
      <IconTimer type={status} />
      <div>{getStatusText(status)}</div>
    </StatusTimeChipWrapper>
  );
};

export default LaunchpadStatusTimeChip;
