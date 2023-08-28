import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconStaking from "@components/common/icons/IconStaking";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";
import { MyPositionCardWrapper } from "./MyPositionCard.styles";

interface MyPositionCardProps {
  content: any;
  breakpoint: DEVICE_TYPE;
}

const MyPositionCard: React.FC<MyPositionCardProps> = ({
  content,
  breakpoint,
}) => {
  return (
    <MyPositionCardWrapper>
      <div className="box-title">
        <div className="box-header">
          <div className="box-left">
            {breakpoint !== DEVICE_TYPE.MOBILE ? (
              <>
                <div className="coin-info">
                  <img
                    src={content.tokenPair.token0.tokenLogo}
                    alt="token logo"
                    className="token-logo"
                  />
                  <img
                    src={content.tokenPair.token1.tokenLogo}
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
                      src={content.tokenPair.token0.tokenLogo}
                      alt="token logo"
                      className="token-logo"
                    />
                    <img
                      src={content.tokenPair.token1.tokenLogo}
                      alt="token logo"
                      className="token-logo"
                    />
                  </div>
                  <span className="product-id">ID {content.productId}</span>
                </div>
              </>
            )}
            {content.tokenPair.isStaked && (
              <Badge
                type={BADGE_TYPE.PRIMARY}
                leftIcon={<IconStaking />}
                text={"Staked"}
              />
            )}
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
                  {content.tokenPair.minAmount} GNOT per GNOS
                </span>
              </div>
              <span className="arrow-text">{"<->"}</span>
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
          <span className="content-text">${content.tokenPair.balance}</span>
        </div>
        <div className="info-box">
          <span className="symbol-text">Total Rewards</span>
          <span className="content-text">
            ${content.tokenPair.totalRewards}
          </span>
        </div>
        <div className="info-box">
          <span className="symbol-text">Estimated APR</span>
          <span className="content-text">
            ✨{content.tokenPair.estimatedAPR}%
          </span>
        </div>
      </div>
    </MyPositionCardWrapper>
  );
};

export default MyPositionCard;
