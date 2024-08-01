import { getCanScrollUpId } from "@constants/common.constant";
import React from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayoutWrapper } from "./DashboardLayout.styles";

interface DashboradLayoutProps {
  header: React.ReactNode;
  tvl: React.ReactNode;
  volume: React.ReactNode;
  info: React.ReactNode;
  activities: React.ReactNode;
  footer: React.ReactNode;
}

const DashboardLayout: React.FC<DashboradLayoutProps> = ({
  header,
  tvl,
  volume,
  info,
  activities,
  footer,
}) => {
  const { t } = useTranslation();

  return (
    <DashboardLayoutWrapper>
      {header}
      <section className="dashboard-section">
        <div className="title-container">
          <h3 className="title">{t("Dashboard:title")}</h3>
        </div>
        <div className="charts-container">
          {tvl}
          {volume}
        </div>
        <div className="dashboard-info-container">{info}</div>
      </section>
      <div
        className="background-wrapper"
        id={getCanScrollUpId("activities-list")}
      >
        <div className="background"></div>
        <section className="activities-section">
          <div className="activities-container">{activities}</div>
        </section>
      </div>
      {footer}
    </DashboardLayoutWrapper>
  );
};

export default DashboardLayout;
