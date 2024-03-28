import React from "react";
import { EarnDescriptionWrapper } from "./EarnDescription.styles";
import IconArrowRight from "@components/common/icons/IconArrowRight";
import OverlapLogo from "@components/common/overlap-logo/OverlapLogo";
import { GNOT_TOKEN, GNS_TOKEN } from "@common/values/token-constant";

const EarnDescription: React.FC = () => {
  return (
    <EarnDescriptionWrapper>
      <div className="card">
        <div className="title-wrapper">
          About Positions
        </div>
        <div className="content-wrapper">
          <div className="description-wrapper">
            Want to know about positions and how to create one?
          </div>
          <div className="link-wrapper">
            <span>Learn about Positions</span>
            <IconArrowRight />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="title-wrapper">
          Stake Position
        </div>
        <div className="content-wrapper">
          <div className="description-wrapper">
            <span className="text">
              Stake your position and earn rewards up to&nbsp;
              <span className="highlight">
              89% APR&nbsp;
              <span className="logo">
                <OverlapLogo
                  size={20}
                  logos={[GNS_TOKEN.logoURI, GNOT_TOKEN.logoURI]}
                />
              </span>
            </span>
            </span>
            <span className="highlight">
              89% APR&nbsp;
              <span className="logo">
                <OverlapLogo
                  size={20}
                  logos={[GNS_TOKEN.logoURI, GNOT_TOKEN.logoURI]}
                />
              </span>
            </span>
          </div>
          <div className="link-wrapper">
            Go to Stake
            <IconArrowRight />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="title-wrapper">
          Incentivize Pool
        </div>
        <div className="content-wrapper">
          <div className="description-wrapper">
            Want to boost up incentives for your favorite pools?
          </div>
          <div className="link-wrapper">
            Go to Incentivize
            <IconArrowRight />
          </div>
        </div>
      </div>
    </EarnDescriptionWrapper>
  );
};

export default EarnDescription;