import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import React from "react";
import { useTranslation } from "react-i18next";

import IconCircleInCancel from "@components/common/icons/IconCircleInCancel";
import IconCircleInCheck from "@components/common/icons/IconCircleInCheck";
import IconInfo from "@components/common/icons/IconInfo";
import IconOutlineClock from "@components/common/icons/IconOutlineClock";
import IconPass from "@components/common/icons/IconPass";
import { StatusBadgeWrapper } from "./StatusBadge.style";
import { DEVICE_TYPE } from "@styles/media";

dayjs.extend(relative);
dayjs.extend(duration);

interface StatusBadgeProps {
  breakpoint: DEVICE_TYPE;
  status: string;
  time: number | null;
  twoline?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ breakpoint, status, time, twoline }) => {
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
      case "EXPIRED":
      case "EXECUTED":
      case "PASSED":
        return (
          <div className="status passed">
            <IconPass className="passed-icon status-icon" />
            {t("Governance:proposal.status.passed")}
          </div>
        );
      case "EXECUTABLE":
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
    if (time === null) {
      return t("Governance:proposal.time.noTime", "Invalid Time");
    }

    const timeString = dayjs(time).format("YYYY-MM-DD, HH:mm:ss");
    const relativeTime = dayjs(time).fromNow();
    const getFormattedTimeInfo = (i18nKey: string, relTime: string) => {
      const text = t(i18nKey, { rel_time: relTime });
      return breakpoint === DEVICE_TYPE.MOBILE ? text : `${text} (${timeString})`;
    };

    switch (status) {
      case "UPCOMING":
        return getFormattedTimeInfo("Governance:proposal.time.start", relativeTime);
      case "ACTIVE":
        return getFormattedTimeInfo("Governance:proposal.time.end", relativeTime);
      case "EXECUTED":
        return getFormattedTimeInfo("Governance:proposal.time.executed", relativeTime);
      case "EXPIRED":
        return getFormattedTimeInfo("Governance:proposal.time.expired", relativeTime);
      case "EXECUTABLE":
        return getFormattedTimeInfo("Governance:proposal.time.executable", relativeTime);
      case "CANCELLED":
        return getFormattedTimeInfo("Governance:proposal.time.cancelled", relativeTime);
      case "PASSED":
      case "REJECTED":
      default:
        return getFormattedTimeInfo("Governance:proposal.time.ended", "");
    }
  };

  return (
    <StatusBadgeWrapper style={{ flexDirection: twoline ? "column" : "row" }}>
      {getContent()}
      <div className="time">
        <IconOutlineClock className="time-icon" />
        {getTimeInfo()}
      </div>
    </StatusBadgeWrapper>
  );
};

export default StatusBadge;
