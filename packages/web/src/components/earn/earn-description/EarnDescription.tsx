import React from "react";
import { EarnDescriptionWrapper } from "./EarnDescription.styles";
import IconArrowRight from "@components/common/icons/IconArrowRight";

const EarnDescription: React.FC = () => {
  return (
    <EarnDescriptionWrapper>
      <div className="card">
        <div className="title-wrapper">
          About Positions
        </div>
        <div className="content-wrapper">
          <div className="description-wrapper">
            Learn about positions and how to create one
          </div>
          <div className="link-wrapper">
            <span>Go to User Guide</span>
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
              Stake your position and earn up to&nbsp;
              <span className="highlight">
              89% APR
            </span>
            </span>
            <span className="highlight">
              89% APR
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
          Join Community
        </div>
        <div className="content-wrapper">
          <div className="description-wrapper">
            Discuss how to optimize your strategy
          </div>
          <div className="link-wrapper">
            Go to Discord
            <IconArrowRight />
          </div>
        </div>
      </div>
    </EarnDescriptionWrapper>
  );
};

export default EarnDescription;