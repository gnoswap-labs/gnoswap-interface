import React from "react";

import { IncentivizePoolHistoryBoxWrapper } from "./IncentivizePoolHistoryBox.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
// import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";

const IncentivizePoolHistoryBox = () => {
  const renderDataMapping = () => {
    return (
      <>
        <div className="row">
          <div className="label">Token</div>
          <div className="value">
            {/* <OverlapTokenLogo tokens={<div></div>} size={24} /> */}
            <span>GNS External</span>
            <Chip text="External" />
          </div>
        </div>
        <div className="row">
          <div className="label">Pool</div>
          <div className="value">
            <DoubleLogo left="" right="" size={24} />
            <span>GNS External</span>
            <Chip text="0.3%" height={24} />
          </div>
        </div>
        <div className="row">
          <div className="label">Start Date</div>
          <div className="value">GNS External</div>
        </div>
        <div className="row">
          <div className="label">End Date</div>
          <div className="value">GNS External</div>
        </div>
        <div className="row">
          <div className="label">
            Incentivized Amount
            <Tooltip
              FloatingContent={
                <>The amount of tokens incentivized to the pool.</>
              }
              placement="top"
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">GNS External</div>
        </div>
        <div className="row">
          <div className="label">
            Remaining Amount
            <Tooltip
              FloatingContent={<>The amount of tokens remaining in the pool.</>}
              placement="top"
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">GNS External</div>
        </div>
        <div className="row">
          <div className="label">
            Unvested Amount
            <Tooltip
              FloatingContent={
                <>
                  The amount of tokens unvested due to warm-up period . This
                  amount will be claimable by the provider address upon the
                  completion of the incentivization.
                </>
              }
              placement="top"
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">GNS External</div>
        </div>
        <div className="row">
          <div className="label">
            Deposit Amount
            <Tooltip
              FloatingContent={
                <>
                  The amount of tokens deposited when this incentivization was
                  created. It’s fully refundable upon the completion of the
                  incentivization.
                </>
              }
              placement="top"
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">GNS External</div>
        </div>

        <div className="button-wrapper">
          <Button
            text={"Claim"}
            style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
          />
        </div>
      </>
    );
  };

  return (
    <IncentivizePoolHistoryBoxWrapper>
      {renderDataMapping()}
    </IncentivizePoolHistoryBoxWrapper>
  );
};

interface ChipProps {
  text: string;
  height?: number;
}

const Chip = ({ text, height }: ChipProps) => {
  return (
    <div className="chip" style={{ height: height ? height : "none" }}>
      {text}
    </div>
  );
};

export default IncentivizePoolHistoryBox;
