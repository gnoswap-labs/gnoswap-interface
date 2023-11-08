import IconCheck from "@components/common/icons/IconCheck";
import IconInfo from "@components/common/icons/IconInfo";
import IconLine from "@components/common/icons/IconLine";
import IconLineLong from "@components/common/icons/IconLineLong";
import Tooltip from "@components/common/tooltip/Tooltip";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";
import {
  PriceTooltipContentWrapper,
  RewardsContent,
  StakingContentCardWrapper,
  TooltipDivider,
} from "./StakingContentCard.styles";

interface StakingContentCardProps {
  item: any;
  breakpoint: DEVICE_TYPE;
}

const TotalRewardsContent = () => {
  return (
    <RewardsContent>
      <div className="list">
        <span className="title">Swap Fees</span>
        <span className="title">*Based on 7d avg</span>
      </div>
      <div className="list">
        <div className="coin-info">
          <img
            src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png"
            alt="token logo"
            className="token-logo"
          />
          <span className="content">5.02K / day</span>
        </div>
        <span className="content">+12.55%</span>
      </div>
      <div className="list">
        <div className="coin-info">
          <img
            src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png"
            alt="token logo"
            className="token-logo"
          />
          <span className="content">973 / day</span>
        </div>
        <span className="content">+15.51%</span>
      </div>
      <TooltipDivider />
      <div className="list">
        <span className="title">Staking Rewards</span>
      </div>
      <div className="list">
        <div className="coin-info">
          <img
            src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png"
            alt="token logo"
            className="token-logo"
          />
          <span className="content">84.8K / day</span>
        </div>
        <span className="content">+183.94%</span>
      </div>
      <TooltipDivider />
      <div className="list">
        <span className="title">External Rewards</span>
      </div>
      <div className="list">
        <div className="coin-info">
          <img
            src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png"
            alt="token logo"
            className="token-logo"
          />
          <span className="content">1.24K / day</span>
        </div>
        <span className="content">+19.75%</span>
      </div>
    </RewardsContent>
  );
};

const PriceTooltipContent = () => {
  return (
    <PriceTooltipContentWrapper>
      <div className="list">
        <span className="title">ID 982932</span>
      </div>
      <div className="list">
        <span className="label">Total Value</span>
        <span className="content">$2,500.24</span>
      </div>
      <div className="list">
        <span className="label">Staked Date</span>
        <span className="content">08/08/2023 17:00:12</span>
      </div>
      <div className="list">
        <span className="label">Next Tier</span>
        <span className="content">in 3d 12h 5s</span>
      </div>
      <TooltipDivider />
      <div className="list">
        <span className="title">ID 982932</span>
      </div>
      <div className="list">
        <span className="label">Total Value</span>
        <span className="content">$2,500.24</span>
      </div>
      <div className="list">
        <span className="label">Staked Date</span>
        <span className="content">08/08/2023 17:00:12</span>
      </div>
      <div className="list">
        <span className="label">Next Tier</span>
        <span className="content">in 3d 12h 5s</span>
      </div>
    </PriceTooltipContentWrapper>
  );
};

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
                src={item.logoURI[0]}
                alt="token logo"
                className="token-logo"
              />
              <img
                src={item.logoURI[1]}
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
          <Tooltip
            placement="top"
            FloatingContent={
              <div>
                <PriceTooltipContent />
              </div>
            }
          >
            <div className="price">
              <span>
                {item.total} +{" "}
                <span className="price-gd-text">{item.staking}</span>
              </span>
              <div className="badge">{item.lp} LP</div>
            </div>
          </Tooltip>
          <div className="apr">
            <Tooltip
              placement="top"
              FloatingContent={
                <div>
                  <TotalRewardsContent />
                </div>
              }
            >
              <span className="apr-gd-text">{item.apr} APR</span>
            </Tooltip>
            <div className="coin-info">
              <img
                src={item.logoURI[0]}
                alt="token logo"
                className="token-logo"
              />
              <img
                src={item.logoURI[1]}
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
