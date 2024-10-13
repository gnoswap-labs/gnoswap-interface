import React from "react";

import { Divider } from "@components/common/divider/divider";
import IconInfo from "@components/common/icons/IconInfo";

import { LaunchpadParticipateWrapper } from "./LaunchpadParticipate.styles";

const LaunchpadParticipate: React.FC = () => {
  return (
    <LaunchpadParticipateWrapper>
      <div className="participate-header">Participate</div>

      <div className="participate-input-wrapper">
        <div className="participate-input-amount">
          <input className="participate-amount-text" placeholder="0" />
          <div className="participate-token-selector">
            {/* <SelectPairButton /> */}
          </div>
        </div>

        <div className="participate-amount-info">
          <span className="participate-price-text">-</span>
          <span className="participate-balance-text">balance: -</span>
        </div>
      </div>

      <Divider />

      <div className="participate-info-wrapper">
        <div className="participate-info">
          <div className="participate-info-key">Pool Tier</div>
          <div className="participate-info-value">-</div>
        </div>
        <div className="participate-info">
          <div className="participate-info-key">
            Rewards Claimable On <IconInfo fill="#596782" size={16} />
          </div>
          <div className="participate-info-value">-</div>
        </div>
        <div className="participate-info">
          <div className="participate-info-key">
            End Date <IconInfo fill="#596782" size={16} />
          </div>
          <div className="participate-info-value">-</div>
        </div>
        <div className="participate-info">
          <div className="participate-info-key">Deposit Amount</div>
          <div className="participate-info-value">-</div>
        </div>
      </div>
    </LaunchpadParticipateWrapper>
  );
};

export default LaunchpadParticipate;
