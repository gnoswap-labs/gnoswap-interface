/**
 * @yjin
 * Todo: Delete This code.
 * Change the image tag to a component.
 */
/* eslint-disable @next/next/no-img-element */
import React from "react";

import { getCanScrollUpId } from "@constants/common.constant";
import { LaunchpadLayoutWrapper } from "./LaunchpadLayout.styles";
import IconRightArrow from "@components/common/icons/IconRightArrow";
import Button from "@components/common/button/Button";
import { Divider } from "@components/common/divider/divider";

interface LaunchpadLayoutProps {
  header: React.ReactNode;
  projects: React.ReactNode;
  icon: React.ReactNode;
  footer: React.ReactNode;
}

const LaunchpadLayout: React.FC<LaunchpadLayoutProps> = ({
  header,
  projects,
  icon,
  // footer,
}) => {
  return (
    <LaunchpadLayoutWrapper>
      {header}
      <main>
        {/* Todo: Abstracting the codeblock for this component @yjin */}
        <div className="launchpad-container">
          <section className="launchpad-section">
            <div className="launchpad-title-container">
              <h3 className="title">GnoSwap Launchpad&nbsp;</h3>
              <h4 className="sub-title">
                Where Pioneers and Supporters Unite — Discover <br />
                the Next Big Thing on gno.land, Powered by $GNS.
              </h4>
            </div>
            <div className="launchpad-button-wrapper">
              <Button
                text={"How to Participate"}
                style={{ textColor: "text32" }}
                rightIcon={<IconRightArrow />}
              />
              <Button
                text={"Submit a Project"}
                style={{ textColor: "text32" }}
                rightIcon={<IconRightArrow />}
              />
            </div>
            <Divider />
            <div className="launchpad-data-wrapper">
              <div className="launchpad-data-list">
                <span className="launchpad-data-value">100,392,491</span>
                <span className="launchpad-data-key">Total Participants</span>
              </div>
              <div className="launchpad-data-list">
                <span className="launchpad-data-value">
                  <img src="/gns.svg" alt="GnoSwap logo" />
                  100,392,491
                </span>
                <span className="launchpad-data-key">Total Deposited GNS</span>
              </div>
              <div className="launchpad-data-list">
                <span className="launchpad-data-value">$100,392,491</span>
                <span className="launchpad-data-key">
                  Total Distributed Amount
                </span>
              </div>
            </div>
          </section>
          <div className="launchpad-image-wrapper">{icon}</div>
        </div>
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
