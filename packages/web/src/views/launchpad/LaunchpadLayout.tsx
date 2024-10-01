import React from "react";
import { useTranslation } from "react-i18next";

import { getCanScrollUpId } from "@constants/common.constant";
import { LaunchpadLayoutWrapper } from "./LaunchpadLayout.styles";

interface LaunchpadLayoutProps {
  header: React.ReactNode;
  footer: React.ReactNode;
}

const LaunchpadLayout: React.FC<LaunchpadLayoutProps> = ({
  header,
  footer,
}) => {
  const { t } = useTranslation();

  return (
    <LaunchpadLayoutWrapper>
      {header}
      <section className="dashboard-section">
        <div className="dashboard-title-container">
          <h3 className="title">{t("Dashboard:title")}</h3>
        </div>
        <div className="charts-container">
          {/* {tvl}
          {volume} */}
        </div>
        {/* <div className="dashboard-info-container">{info}</div> */}
      </section>
      <div
        className="background-wrapper"
        id={getCanScrollUpId("activities-list")}
      >
        <div className="background"></div>
        <section className="activities-section">
          {/* <div className="activities-container">{activities}</div> */}
        </section>
      </div>
      {footer}
    </LaunchpadLayoutWrapper>
  );
};

export default LaunchpadLayout;
