import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import React from "react";

import IconCircleInCancel from "@components/common/icons/IconCircleInCancel";
import IconCircleInCheck from "@components/common/icons/IconCircleInCheck";
import IconInfo from "@components/common/icons/IconInfo";
import IconOutlineClock from "@components/common/icons/IconOutlineClock";
import IconPass from "@components/common/icons/IconPass";
import { StatusBadgeWrapper } from "./StatusBadge.style";

dayjs.extend(relative);

interface StatusBadgeProps {
  status: string;
  time: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, time }) => {

  const getContent = () => {
    switch (status) {
      case "Upcomming":
        return (
          <div className="status success">
            <IconCircleInCheck className="success-icon status-icon" /> Upcoming
          </div>
        );
      case "Active":
        return (
          <div className="status success">
            <IconCircleInCheck className="success-icon status-icon" /> Active
          </div>
        );
      case "Executed":
      case "Passed":
        return (
          <div className="status passed">
            <IconPass className="passed-icon status-icon" /> Passed
          </div>
        );
      case "Rejected":
        return (
          <div className="status failed">
            <IconCircleInCancel className="failed-icon status-icon" /> Reject
          </div>
        );
      case "Cancelled":
      default:
        return (
          <div className="status cancelled">
            <IconInfo className="cancelled-icon status-icon" /> Cancelled
          </div>
        );
    }
  };

  return (
    <StatusBadgeWrapper>
      {getContent()}
      <div className="time">
        <IconOutlineClock className="status-icon" />{" "}
        {`Voting ${
          status === "ACTIVE" ? "Ends in" : "Ended"
        } ${dayjs(time).fromNow()} `}
        <br />
        {time}
      </div>
    </StatusBadgeWrapper>
  );
};

export default StatusBadge;

