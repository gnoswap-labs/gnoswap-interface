/**
 * @yjin
 * Todo: Delete This code.
 * Change the image tag to a component.
 */
/* eslint-disable @next/next/no-img-element */
import React from "react";

import { LaunchpadLayoutWrapper } from "./LaunchpadLayout.styles";

interface LaunchpadLayoutProps {
  header: React.ReactNode;
  main: React.ReactNode;
  activeProjects: React.ReactNode;
  projectList: React.ReactNode;
  footer: React.ReactNode;
}

const LaunchpadLayout: React.FC<LaunchpadLayoutProps> = ({
  header,
  main,
  activeProjects,
  projectList,
  // footer,
}) => {
  return (
    <LaunchpadLayoutWrapper>
      {header}
      <main>
        <div className="launchpad-container">{main}</div>
        <div className="launchpad-active-project">{activeProjects}</div>
      </main>
      <div className="background-wrapper">
        <div className="background" />
        <section className="projects-section">
          <div className="projects-container">
            <div className="project-list">{projectList}</div>
          </div>
        </section>
      </div>
      {/* {footer} */}
    </LaunchpadLayoutWrapper>
  );
};

export default LaunchpadLayout;
