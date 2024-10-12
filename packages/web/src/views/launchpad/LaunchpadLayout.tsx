/**
 * @yjin
 * Todo: Delete This code.
 * Change the image tag to a component.
 */
/* eslint-disable @next/next/no-img-element */
import React from "react";

import { getCanScrollUpId } from "@constants/common.constant";
import { LaunchpadLayoutWrapper } from "./LaunchpadLayout.styles";

interface LaunchpadLayoutProps {
  header: React.ReactNode;
  main: React.ReactNode;
  projects: React.ReactNode;
  footer: React.ReactNode;
}

const LaunchpadLayout: React.FC<LaunchpadLayoutProps> = ({
  header,
  main,
  projects,
  // footer,
}) => {
  return (
    <LaunchpadLayoutWrapper>
      {header}
      <main>
        <div className="launchpad-container">{main}</div>
        <div className="launchpad-active-project">{projects}</div>
      </main>

      <div
        className="background-wrapper"
        id={getCanScrollUpId("activities-list")}
      >
        <div className="background"></div>
        <section className="activities-section"></section>
      </div>
      {/* {footer} */}
    </LaunchpadLayoutWrapper>
  );
};

export default LaunchpadLayout;
