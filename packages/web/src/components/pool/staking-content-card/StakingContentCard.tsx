import IconCheck from "@components/common/icons/IconCheck";
import IconInfo from "@components/common/icons/IconInfo";
import IconLine from "@components/common/icons/IconLine";
import IconLineLong from "@components/common/icons/IconLineLong";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";
import { StakingContentCardWrapper } from "./StakingContentCard.styles";

interface StakingContentCardProps {
  item: any;
  breakpoint: DEVICE_TYPE;
}

const StakingContentCard: React.FC<StakingContentCardProps> = ({
  item,
  breakpoint,
}) => {
  return (
    <StakingContentCardWrapper>
      <div className="left">
        <div className="mobile-wrap">
          <div className="check-wrap">
            <IconCheck />

            {breakpoint === DEVICE_TYPE.MOBILE ? (
              <div className="check-line-long">
                <IconLineLong />
              </div>
            ) : (
              <div className="check-line">
                <IconLine />
              </div>
            )}
          </div>
          <div className="name-wrap">
            <span className="symbol-text">{item.title}</span>
            <div className="icon-wrap">
              <span className="content-text">{item.multiplier}</span>
              <IconInfo className="tooltip-icon" />
            </div>
          </div>
        </div>
      </div>
      <div className="contents-wrap">
        <div className="contents">
          <div className="price">
            <span>$0</span>
            <div className="badge">{item.lp} LP</div>
          </div>
          <div className="apr">
            <span className="apr-text">{item.apr} APR</span>
            <div className="coin-info">
              <img
                src={item.tokenLogo[0]}
                alt="token logo"
                className="token-logo"
              />
              <img
                src={item.tokenLogo[1]}
                alt="token logo"
                className="token-logo"
              />
            </div>
          </div>
        </div>
      </div>
    </StakingContentCardWrapper>
  );
};

interface SummuryAprProps {
  item: any;
}

export const SummuryApr: React.FC<SummuryAprProps> = ({ item }) => {
  return (
    <StakingContentCardWrapper>
      <div className="left">
        <div className="mobile-wrap">
          <div className="check-wrap">
            <IconCheck />
          </div>
          <div className="name-wrap">
            <span className="symbol-text">{item.title}</span>
            <div className="icon-wrap">
              <span className="content-gd-text">{item.multiplier}</span>
              <IconInfo className="tooltip-icon" />
            </div>
          </div>
        </div>
      </div>
      <div className="contents-wrap">
        <div className="contents">
          <div className="price">
            <span>
              {item.total} +{" "}
              <span className="price-gd-text">{item.staking}</span>
            </span>
            <div className="badge">{item.lp} LP</div>
          </div>
          <div className="apr">
            <span className="apr-gd-text">{item.apr} APR</span>
            <div className="coin-info">
              <img
                src={item.tokenLogo[0]}
                alt="token logo"
                className="token-logo"
              />
              <img
                src={item.tokenLogo[1]}
                alt="token logo"
                className="token-logo"
              />
            </div>
          </div>
        </div>
      </div>
    </StakingContentCardWrapper>
  );
};

export default StakingContentCard;
