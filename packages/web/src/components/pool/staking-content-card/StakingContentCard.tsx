import DoubleLogo from "@components/common/double-logo/DoubleLogo";
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
  ToolTipContentWrapper,
  TooltipDivider,
} from "./StakingContentCard.styles";

interface StakingContentCardProps {
  item: any;
  breakpoint: DEVICE_TYPE;
  index: number;
}

const TotalRewardsContent = () => {
  return (
    <RewardsContent>
      <div className="list">
        <span className="title">Staking Rewards</span>
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

const PriceTooltipContent = ({ item } : { item: any }) => {
  return (
    <PriceTooltipContentWrapper>
      <div className="list list-logo">
        <DoubleLogo
          size={18}
          left={item.logoURI[0]}
          right={item.logoURI[1]}
        />
        <span className="title">ID #982932</span>
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
      <div className="list list-logo">
        <DoubleLogo
          size={18}
          left={item.logoURI[0]}
          right={item.logoURI[1]}
        />
        <span className="title">ID #982932</span>
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
  index,
}) => {
  return (
    <StakingContentCardWrapper>
      <div className="left">
        <div className="mobile-wrap">
          <div className={`check-wrap ${index > item.currentIndex ? "check-wrap-not-active" : ""}`}>
            {index <= item.currentIndex && <IconCheck />}

            {(breakpoint === DEVICE_TYPE.MOBILE || breakpoint === DEVICE_TYPE.TABLET_M) ? (
              <div className="check-line-long">
                {index <= item.currentIndex ? <IconLineLong /> : <div className="border-not-active" />}
              </div>
            ) : (
              <div className="check-line">
                {index <= item.currentIndex ? <IconLine /> : <div className="border-not-active" />}
              </div>
            )}
          </div>
          <div className="name-wrap">
            <span className="symbol-text">{item.title}</span>
            <div className="icon-wrap">
              <span className="content-text">{item.multiplier}</span>
              <Tooltip
                placement="top"
                FloatingContent={<ToolTipContentWrapper>{item.tooltipContent}</ToolTipContentWrapper>}
              >
                <IconInfo className="tooltip-icon" />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <div className="contents-wrap">
        <div className="contents">
          <div className="price">
            <span>
              <Tooltip
                placement="top"
                FloatingContent={
                  <div>
                    <PriceTooltipContent item={item} />
                  </div>
                }
              >
                <span>{item.total}</span>
                {index <= item.currentIndex && "+ "}
                {index <= item.currentIndex && <span className="price-gd-text">{item.staking}</span>}
                <div className="badge">{item.lp} LP</div>
              </Tooltip>
            </span>
          </div>
          <div className="apr">
            <Tooltip
              placement="top"
              FloatingContent={
                <div>
                  <TotalRewardsContent />
                </div>
              }
            >
              <span className="apr-text">{item.apr} APR</span>
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

interface SummuryAprProps {
  item: any;
  index: number;
}

export const SummuryApr: React.FC<SummuryAprProps> = ({ item, index }) => {
  return (
    <StakingContentCardWrapper>
      <div className="left">
        <div className="mobile-wrap">
          <div className={`check-wrap ${item.currentIndex < 4 ? "check-wrap-not-active" : ""}`}>
            {index < item.currentIndex && <IconCheck />}
          </div>
          <div className="name-wrap">
            <span className="symbol-text">{item.title}</span>
            <div className="icon-wrap">
              <span className="content-gd-text">{item.multiplier}</span>
              <Tooltip
                placement="top"
                FloatingContent={<ToolTipContentWrapper>{item.tooltipContent}</ToolTipContentWrapper>}
              >
                <IconInfo className="tooltip-icon" />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <div className="contents-wrap">
        <div className="contents">
            <div className="price">
              <span>
                <Tooltip
                  placement="top"
                  FloatingContent={
                    <div>
                      <PriceTooltipContent item={item} />
                    </div>
                  }
                >
                  <span>{item.total}</span>
                  {index <= item.currentIndex &&  "+ "}
                  {index <= item.currentIndex && <span className="price-gd-text">{item.staking}</span>}
                  <div className="badge">{item.lp} LP</div>
                </Tooltip>
              </span>
            </div>
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
