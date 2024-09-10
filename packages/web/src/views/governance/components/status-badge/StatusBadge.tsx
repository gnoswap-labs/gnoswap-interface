import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import React from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const getContent = () => {
    switch (status) {
      case "UPCOMING":
        return (
          <div className="status success">
            <IconCircleInCheck className="success-icon status-icon" />
            {t("Governance:proposal.status.upcoming")}
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

  const getTimeInfo = () => {
    const timeString = dayjs(time).format("YYYY-MM-DD, hh:mm:ss");
    switch (status) {
      case "UPCOMING":
        return `${t("Governance:proposal.time.start", {
          rel_time: dayjs(time).fromNow(),
        })} (${timeString})`;
      case "ACTIVE":
        return `${t("Governance:proposal.time.end", {
          rel_time: dayjs(time).fromNow(),
        })} (${timeString})`;
      case "EXECUTED":
      case "PASSED":
      case "REJECTED":
      case "CANCELLED":
      default:
        return `${t("Governance:proposal.time.ended", {
          rel_time: dayjs(time).fromNow(),
        })} (${timeString})`;
    }
  };

  return (
    <StatusBadgeWrapper>
      {getContent()}
      <div className="time">
        <IconOutlineClock className="status-icon" />
        {getTimeInfo()}
      </div>
    </StatusBadgeWrapper>
  );
};

export default StatusBadge;

