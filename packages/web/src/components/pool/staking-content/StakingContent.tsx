import React from "react";
import StakingContentCard, {
  SummuryApr,
} from "@components/pool/staking-content-card/StakingContentCard";
import { StakingContentWrapper } from "./StakingContent.styles";
import Button from "@components/common/button/Button";
import { DEVICE_TYPE } from "@styles/media";

interface StakingContentProps {
  content: any[];
  rewardInfo: any;
  breakpoint: DEVICE_TYPE;
  mobile: boolean;
}

const StakingContent: React.FC<StakingContentProps> = ({
  content,
  rewardInfo,
  breakpoint,
  mobile,
}) => {
  return (
    <StakingContentWrapper isMobile={mobile}>
      <div className="content-header">
        <span>Stake your position to earn rewards up to </span>
        <div className="header-wrap">
          <span className="apr">{rewardInfo.apr}% APR </span>
          <div className="coin-info">
            <img
              src={rewardInfo.tokenPair.token0.tokenLogo}
              alt="token logo"
              className="token-logo"
            />
            <img
              src={rewardInfo.tokenPair.token1.tokenLogo}
              alt="token logo"
              className="token-logo"
            />
          </div>
        </div>
      </div>
      <div className="staking-wrap">
        <>
          <span>My Staking</span>
          {content.map((item, idx) => {
            return idx + 1 === content.length ? (
              <SummuryApr key={idx} item={content[content.length - 1]} />
            ) : (
              <StakingContentCard
                item={item}
                key={idx}
                breakpoint={breakpoint}
              />
            );
          })}
        </>
      </div>
      <div className="button-wrap">
        <Button
          text={"Receiving Max Rewards ✨"}
          style={{
            width: `${
              breakpoint === DEVICE_TYPE.WEB
                ? "800px"
                : breakpoint === DEVICE_TYPE.MOBILE
                ? "272px"
                : "600px"
            }`,
            height: `${breakpoint === DEVICE_TYPE.MOBILE ? "49px" : "60px"}`,
            fontType: `${
              breakpoint === DEVICE_TYPE.WEB
                ? "body7"
                : breakpoint === DEVICE_TYPE.MOBILE
                ? "p2"
                : "body9"
            }`,
            textColor: "text19",
            bgColor: "background18",
            padding: "10px 16px",
            gap: "8px",
          }}
          onClick={() => {}}
        />
      </div>
    </StakingContentWrapper>
  );
};

export default StakingContent;
