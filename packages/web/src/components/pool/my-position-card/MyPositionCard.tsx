import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconStaking from "@components/common/icons/IconStaking";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import Tooltip from "@components/common/tooltip/Tooltip";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";
import { MyPositionCardWrapper, RewardsContent, TooltipContent, TooltipDivider } from "./MyPositionCard.styles";

interface MyPositionCardProps {
  content: any;
  breakpoint: DEVICE_TYPE;
}

export const BalanceTooltipContent = ({ content } : { content : any }) => {
  return (
    <TooltipContent>
      <span className="title">Balance</span>
      <div className="list">
        <div className="coin-info">
          <img
            src={content.tokenPair.tokenA.logoURI}
            alt="token logo"
            className="token-logo"
          />
          <span className="content">
            {content.tokenPair.tokenA.symbol}
          </span>
        </div>
        <span className="content">50.05881</span>
      </div>
      <div className="list">
        <div className="coin-info">
          <img
            src={content.tokenPair.tokenB.logoURI}
            alt="token logo"
            className="token-logo"
          />
          <span className="content">
            {content.tokenPair.tokenB.symbol}
          </span>
        </div>
        <span className="content">50.05881</span>
      </div>
    </TooltipContent>
  );
};

export const TotalRewardsContent = ({ content, isReward } : { content : any, isReward?: boolean }) => {
  return (
    <RewardsContent>
      <div className="list">
        <span className="title">Swap Fees</span>
        <span className="title">{isReward ? "$150.21" : "*Based on 7d avg"}</span>
      </div>
      <div className="list">
        <div className="coin-info">
          <img
            src={content.tokenPair.tokenA.logoURI}
            alt="token logo"
            className="token-logo"
          />
          <span className="content">
            {content.tokenPair.tokenA.symbol}
          </span>
        </div>
        <span className="content">
          {isReward ? "50.05881" : "+12.55%"}
        </span>
      </div>
      <div className="list">
        <div className="coin-info">
          <img
            src={content.tokenPair.tokenB.logoURI}
            alt="token logo"
            className="token-logo"
          />
          <span className="content">
            {content.tokenPair.tokenB.symbol}
          </span>
        </div>
        <span className="content">
          {isReward ? "150.0255" : "+12.55%"}
        </span>
      </div>
      <TooltipDivider />
      <div className="list">
        <span className="title">Staking Rewards</span>
        <span className="title">{isReward && "$82.21"}</span>
      </div>
      <div className="list">
        <div className="coin-info">
          <img
            src={content.tokenPair.tokenA.logoURI}
            alt="token logo"
            className="token-logo"
          />
          <span className="content">
            GNS
          </span>
        </div>
        <span className="content">
          {isReward ? "50.05881" : "+183.94%"}
        </span>
      </div>
      <TooltipDivider />
      <div className="list">
        <span className="title">External Rewards</span>
        <span className="title">{isReward && "$82.21"}</span>
      </div>
      <div className="list">
        <div className="coin-info">
          <img
            src={content.tokenPair.tokenB.logoURI}
            alt="token logo"
            className="token-logo"
          />
          <span className="content">
            1.24K / day
          </span>
        </div>
        <span className="content">
          +19.75%
        </span>
      </div>
    </RewardsContent>
  );
};

const MyPositionCard: React.FC<MyPositionCardProps> = ({
  content,
  breakpoint,
}) => {
  return (
    <MyPositionCardWrapper type={content.tokenPair.range}>
      <div className="box-title">
        <div className="box-header">
          <div className="box-left">
            {breakpoint !== DEVICE_TYPE.MOBILE ? (
              <>
                <div className="coin-info">
                  <img
                    src={content.tokenPair.tokenA.logoURI}
                    alt="token logo"
                    className="token-logo"
                  />
                  <img
                    src={content.tokenPair.tokenB.logoURI}
                    alt="token logo"
                    className="token-logo"
                  />
                </div>
                <span className="product-id">ID {content.productId}</span>
              </>
            ) : (
              <>
                <div className="mobile-container">
                  <div className="coin-info">
                    <img
                      src={content.tokenPair.tokenA.logoURI}
                      alt="token logo"
                      className="token-logo"
                    />
                    <img
                      src={content.tokenPair.tokenB.logoURI}
                      alt="token logo"
                      className="token-logo"
                    />
                  </div>
                  <span className="product-id">ID {content.productId}</span>
                </div>
              </>
            )}
            <Badge
              type={BADGE_TYPE.PRIMARY}
              leftIcon={<IconStaking />}
              text={"Staked"}
              className={!content.tokenPair.isStaked ? "visible-badge" : ""}
            />
          </div>
          <div className="mobile-wrap">
            <RangeBadge
              status={
                content.tokenPair.range === true
                  ? RANGE_STATUS_OPTION.IN
                  : RANGE_STATUS_OPTION.OUT
              }
            />
          </div>
        </div>
        <div className="min-max">
          {breakpoint !== DEVICE_TYPE.MOBILE ? (
            <>
              <span className="symbol-text">Min</span>
              <span className="token-text">
                {content.tokenPair.minAmount} GNOT per GNOS
              </span>
              <span className="symbol-text">{"<->"}</span>
              <span className="symbol-text">Max</span>
              <span className="token-text">
                {content.tokenPair.maxAmount} GNOT per GNOS
              </span>
            </>
          ) : (
            <>
              <div className="min-mobile">
                <span className="symbol-text">Min</span>
                <span className="token-text">
                  {content.tokenPair.minAmount} GNOT per GNOS {"<->"}
                </span>
              </div>
              <div className="max-mobile">
                <span className="symbol-text">Max</span>
                <span className="token-text">
                  {content.tokenPair.maxAmount} GNOT per GNOS
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="info-wrap">
        <div className="info-box">
          <span className="symbol-text">Balance</span>
          <Tooltip placement="top" FloatingContent={<div><BalanceTooltipContent content={content} /></div>}>
            <span className="content-text">${content.tokenPair.balance}</span>
          </Tooltip>
        </div>
        <div className="info-box">
          <span className="symbol-text">Total Rewards</span>
          <Tooltip placement="top" FloatingContent={<div><TotalRewardsContent content={content} isReward/></div>}>
            <span className="content-text">
              ${content.tokenPair.totalRewards}
            </span>
          </Tooltip>
        </div>
        <div className="info-box">
          <span className="symbol-text">Estimated APR</span>
          <Tooltip placement="top" FloatingContent={<div><TotalRewardsContent content={content} /></div>}>
            <span className="content-text">
              {Number(content.tokenPair.estimatedAPR) >= 100 && "✨"}{content.tokenPair.estimatedAPR}%
            </span>
          </Tooltip>
        </div>
      </div>
    </MyPositionCardWrapper>
  );
};

export default MyPositionCard;
