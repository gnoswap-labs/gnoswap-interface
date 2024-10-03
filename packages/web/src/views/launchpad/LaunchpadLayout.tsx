import React from "react";

import { getCanScrollUpId } from "@constants/common.constant";
import { LaunchpadLayoutWrapper } from "./LaunchpadLayout.styles";
import IconRightArrow from "@components/common/icons/IconRightArrow";
import Button from "@components/common/button/Button";

interface LaunchpadLayoutProps {
  header: React.ReactNode;
  icon: React.ReactNode;
  footer: React.ReactNode;
}

const LaunchpadLayout: React.FC<LaunchpadLayoutProps> = ({
  header,
  icon,
  // footer,
}) => {
  return (
    <LaunchpadLayoutWrapper>
      {header}
      <main>
        <section className="launchpad-section">
          <div className="launchpad-title-container">
            <h3 className="title">GnoSwap Launchpad</h3>
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
        </section>
        <div className="launchpad-image-wrapper">{icon}</div>
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
