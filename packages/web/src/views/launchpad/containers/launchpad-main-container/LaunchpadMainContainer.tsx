/* eslint-disable @next/next/no-img-element */
import React from "react";

import Button from "@components/common/button/Button";
import IconRightArrow from "@components/common/icons/IconRightArrow";
import { Divider } from "@components/common/divider/divider";
import { useGetLaunchpadSummary } from "@query/launchpad/use-get-launchpad-summary";

interface LaunchpadMainContainerProps {
  icon: React.ReactNode;
}

const LaunchpadMainContainer: React.FC<LaunchpadMainContainerProps> = ({
  icon,
}) => {
  const { data: launchpadSummary } = useGetLaunchpadSummary();
  return (
    <>
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
            <span className="launchpad-data-value">
              {launchpadSummary?.totalParticipants.toLocaleString() || 0}
            </span>
            <span className="launchpad-data-key">Total Participants</span>
          </div>
          <div className="launchpad-data-list">
            <span className="launchpad-data-value">
              <img src="/gns.svg" alt="GnoSwap logo" />
              {launchpadSummary?.totalDepositedGNSAmount.toLocaleString() || 0}
            </span>
            <span className="launchpad-data-key">Total Deposited GNS</span>
          </div>
          <div className="launchpad-data-list">
            <span className="launchpad-data-value">
              ${launchpadSummary?.totalDistributedAmount.toLocaleString() || 0}
            </span>
            <span className="launchpad-data-key">Total Distributed Amount</span>
          </div>
        </div>
      </section>
      <div className="launchpad-image-wrapper">{icon}</div>
    </>
  );
};

export default LaunchpadMainContainer;