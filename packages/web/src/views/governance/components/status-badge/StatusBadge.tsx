import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import React from "react";

import IconCircleInCancel from "@components/common/icons/IconCircleInCancel";
import IconCircleInCheck from "@components/common/icons/IconCircleInCheck";
import IconInfo from "@components/common/icons/IconInfo";
import IconOutlineClock from "@components/common/icons/IconOutlineClock";
import IconPass from "@components/common/icons/IconPass";
import { StatusBadgeWrapper } from "./StatusBadge.style";
import { useTranslation } from "react-i18next";

dayjs.extend(relative);

interface StatusBadgeProps {
  status: string;
  time: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, time }) => {
  const {t} = useTranslation();

  const getContent = () => {
    switch (status) {
      case "UPCOMING":
        return (
          <div className="status success">
            <IconCircleInCheck className="success-icon status-icon" />
            {t("Governance:proposal.status.upcomming")}
          </div>
        );
      case "ACTIVE":
        return (
          <div className="status success">
            <IconCircleInCheck className="success-icon status-icon" />
            {t("Governance:proposal.status.active")}
          </div>
        );
      case "EXECUTED":
      case "PASSED":
        return (
          <div className="status passed">
            <IconPass className="passed-icon status-icon" />
            {t("Governance:proposal.status.passed")}
          </div>
        );
      case "REJECTED":
        return (
          <div className="status failed">
            <IconCircleInCancel className="failed-icon status-icon" />
            {t("Governance:proposal.status.rejected")}
          </div>
        );
      case "CANCELLED":
      default:
        return (
          <div className="status cancelled">
            <IconInfo className="cancelled-icon status-icon" />
            {t("Governance:proposal.status.cancelled")}
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

