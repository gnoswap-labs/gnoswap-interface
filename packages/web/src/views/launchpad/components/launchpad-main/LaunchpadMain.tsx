/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

import { LaunchpadProjectSummaryModel } from "@models/launchpad";

import Button from "@components/common/button/Button";
import { ButtonStyleProps } from "@components/common/button/Button.styles";
import IconRightArrow from "@components/common/icons/IconRightArrow";
import { Divider } from "@components/common/divider/divider";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { ThemeKeys } from "@styles/ThemeTypes";
import { toNumberFormat } from "@utils/number-utils";

interface LaunchpadMainProps {
  data?: LaunchpadProjectSummaryModel;
  isLoading: boolean;
  isFetched: boolean;
  themeKey: ThemeKeys;
  icon: React.ReactNode;
}

const LaunchpadMain: React.FC<LaunchpadMainProps> = ({
  data,
  isLoading,
  themeKey,
  icon,
}) => {
  const defaultStyle: ButtonStyleProps = {
    textColor: "text32",
    bgColor: themeKey === "dark" ? "border02" : "background04",
  };

  return (
    <>
      <section className="launchpad-section">
        <div className="launchpad-title-container">
          <h3 className="title">GnoSwap Launchpad&nbsp;</h3>
          <h4 className="sub-title">
            Where Pioneers and Supporters Unite — Unveil Tomorrow&apos;s <br />
            Breakthroughs on gno.land, Powered by $GNS.
          </h4>
        </div>
        <div className="launchpad-button-wrapper">
          <Link href="https://docs.gnoswap.io" target="_blank">
            <Button
              text={"How to Participate"}
              style={defaultStyle}
              rightIcon={<IconRightArrow />}
            />
          </Link>
          <Link href="https://docs.gnoswap.io" target="_blank">
            <Button
              text={"Submit a Project"}
              style={defaultStyle}
              rightIcon={<IconRightArrow />}
            />
          </Link>
        </div>
        <Divider />
        <div className="launchpad-data-wrapper">
          <div className="launchpad-data-list">
            {isLoading && (
              <span className="launchpad-data-value">
                <span css={pulseSkeletonStyle({ w: "120px", h: 18 })} />
              </span>
            )}
            {!isLoading && (
              <span className="launchpad-data-value">
                {data?.totalParticipants
                  ? toNumberFormat(data.totalParticipants, 2)
                  : "-"}
              </span>
            )}
            <span className="launchpad-data-key">Total Participants</span>
          </div>
          <div className="launchpad-data-list">
            {isLoading && (
              <span className="launchpad-data-value">
                <span css={pulseSkeletonStyle({ w: "120px", h: 18 })} />
              </span>
            )}
            {!isLoading && (
              <span className="launchpad-data-value">
                <img src="/gns.svg" alt="GnoSwap logo" />
                {data?.totalDepositedGNSAmount
                  ? toNumberFormat(data.totalDepositedGNSAmount, 2)
                  : "-"}
              </span>
            )}
            <span className="launchpad-data-key">Total Deposited GNS</span>
          </div>
          <div className="launchpad-data-list">
            {isLoading && (
              <span className="launchpad-data-value">
                <span css={pulseSkeletonStyle({ w: "120px", h: 18 })} />
              </span>
            )}
            {!isLoading && (
              <span className="launchpad-data-value">
                {data?.totalDistributedAmount
                  ? `$${toNumberFormat(data.totalDistributedAmount, 2)}`
                  : "-"}
              </span>
            )}
            <span className="launchpad-data-key">Total Distributed Amount</span>
          </div>
        </div>
      </section>
      <div className="launchpad-image-wrapper">{icon}</div>
    </>
  );
};

export default LaunchpadMain;
