import React from "react";
import { useTranslation } from "react-i18next";

import { DEVICE_TYPE } from "@styles/media";

import { LaunchpadDetailLayoutWrapper } from "./LaunchpadDetailLayout.styles";

interface LaunchpadDetailLayoutProps {
  breakpoint: DEVICE_TYPE;
  header: React.ReactNode;
  breadcrumbs: React.ReactNode;
  contentsHeader: React.ReactNode;
  poolList: React.ReactNode;
  projectSummary: React.ReactNode;
  aboutProject: React.ReactNode;
  participate: React.ReactNode;
  myParticipation: React.ReactNode;
  clickHere: React.ReactNode;
  footer: React.ReactNode;
}

const LaunchpadDetailLayout: React.FC<LaunchpadDetailLayoutProps> = ({
  breakpoint,
  header,
  breadcrumbs,
  contentsHeader,
  poolList,
  projectSummary,
  aboutProject,
  participate,
  myParticipation,
  clickHere,
  footer,
}) => {
  const { t } = useTranslation();
  return (
    <LaunchpadDetailLayoutWrapper>
      {header}
      <main>
        <section className="header-section">
          <div className="header">
            <h3 className="title">{t("Launchpad:detail.title")}</h3>
            <div>{breadcrumbs}</div>
          </div>
        </section>

        <section className="contents-section">
          {contentsHeader}
          <div className="main-container">
            <div className="main-section">
              {breakpoint !== DEVICE_TYPE.MOBILE && (
                <div className="pool-list">{poolList}</div>
              )}
              <div className="project-summary">{projectSummary}</div>
              <div className="about-project">{aboutProject}</div>
            </div>
            <div className="right-section">
              {breakpoint === DEVICE_TYPE.MOBILE && (
                <div className="pool-list">{poolList}</div>
              )}
              <div className="participate">{participate}</div>
              <div className="my-participation">{myParticipation}</div>
              <div className="click-here">{clickHere}</div>
            </div>
          </div>
        </section>
      </main>
      {footer}
    </LaunchpadDetailLayoutWrapper>
  );
};

export default LaunchpadDetailLayout;
