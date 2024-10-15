/**
 * @yjin
 * Todo: Delete This code.
 * Change the image tag to a component.
 */
/* eslint-disable @next/next/no-img-element */
import React from "react";

import IconTimer from "@components/common/icons/IconTimer";

import { LaunchpadDetailLayoutWrapper } from "./LaunchpadDetailLayout.styles";

interface LaunchpadDetailLayoutProps {
  header: React.ReactNode;
  breadcrumbs: React.ReactNode;
  poolList: React.ReactNode;
  projectSummary: React.ReactNode;
  aboutProject: React.ReactNode;
  participate: React.ReactNode;
  myParticipation: React.ReactNode;
  clickHere: React.ReactNode;
  footer: React.ReactNode;
}

const LaunchpadDetailLayout: React.FC<LaunchpadDetailLayoutProps> = ({
  header,
  breadcrumbs,
  poolList,
  projectSummary,
  aboutProject,
  participate,
  myParticipation,
  clickHere,
  footer,
}) => {
  return (
    <LaunchpadDetailLayoutWrapper>
      {header}
      <main>
        <section className="header-section">
          <div className="header">
            <h3 className="title">Launchpad</h3>
            <div>{breadcrumbs}</div>
          </div>
        </section>

        <section className="contents-section">
          <div className="contents-header">
            <div className="symbol-icon">
              <img src="/gns.svg" alt="token symbol image" />
            </div>
            <div className="project-name">GnoSwap Protocol</div>
            <div className="project-status">
              <IconTimer type="ENDED" /> Ended
            </div>
          </div>

          <div className="main-container">
            <div className="main-section">
              <div className="pool-list">{poolList}</div>
              <div className="project-summary">{projectSummary}</div>
              <div className="about-project">{aboutProject}</div>
            </div>
            <div className="right-section">
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
