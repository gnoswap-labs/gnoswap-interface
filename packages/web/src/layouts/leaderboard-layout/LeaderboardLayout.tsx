import React, { useState } from "react";

import { LeaderboardLayoutWrapper } from "./LeaderboardLayout.styles";
import { DescriptionTitle } from "@components/home/gnoswap-brand/GnoswapBrand.styles";
import IconFile from "@components/common/icons/IconFile";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconLink from "@components/common/icons/IconLink";

const LeaderboardLayout = ({
  header,
  list,
  footer,
}: {
  header: React.ReactNode;
  list: React.ReactNode;
  footer: React.ReactNode;
}) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const copyContent = "COPY!";

    navigator.clipboard
      .writeText(copyContent)
      .then(() => setCopied(true))
      .then(() => setTimeout(() => setCopied(false), 3000));
  };

  return (
    <LeaderboardLayoutWrapper>
      {header}
      <section className="leaderboard-section">
        <div className="title-container">
          <h3 className="title">Leaderboard</h3>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",

              flexDirection: "column",
              gap: "36px",
            }}
          >
            <DescriptionTitle>
              {/* <>
                Climb up the leaderboard by collecting points for swapping,
                providing liquidity,
                <br />
                staking, or inviting friends. Every activity on GnoSwap counts!
              </> */}
              {/* <>
                Climb up the leaderboard by collecting points for swapping,
                providing liquidity, staking, or inviting friends. <br />
                Every activity on GnoSwap counts!
              </> */}
              <>
                Climb up the leaderboard by collecting points for swapping,
                providing liquidity, staking, or inviting friends. Every
                activity on GnoSwap counts!
              </>
              <div
                className="sub-title-layout"
                // onClick={() => setIsShowLearnMoreModal(true)}
              >
                <p>Learn More</p>
                <IconFile />
              </div>
            </DescriptionTitle>

            <div>
              {/* TODO: btn font size */}
              <Button
                onClick={copy}
                text={copied ? "Copied!" : "Copy Referral Link"}
                style={{
                  hierarchy: ButtonHierarchy.Primary,
                  padding: "10px 16px 10px 16px",
                  gap: "10px",
                  width: "100%",
                }}
                leftIcon={copied || <IconLink className="setting-icon" />}
                className="button-connect-wallet"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="background-wrapper">
        <section className="activities-section">
          <div className="activities-container">{list}</div>
        </section>
      </div>
      {footer}
    </LeaderboardLayoutWrapper>
  );
};

export default LeaderboardLayout;
