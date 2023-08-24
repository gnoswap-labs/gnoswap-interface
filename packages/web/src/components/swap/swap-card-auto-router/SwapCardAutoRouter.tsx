import React from "react";
import { AutoRouterWrapper, DotLine } from "./SwapCardAutoRouter.styles";
import { TokenInfo } from "../swap-card/SwapCard";
import { AutoRouterInfo } from "@containers/swap-container/SwapContainer";
import IconLogoPrimary from "@components/common/icons/IconLogoPrimary";

interface ContentProps {
  to: TokenInfo;
  from: TokenInfo;
  autoRouterInfo: AutoRouterInfo;
}

const SwapCardAutoRouter: React.FC<ContentProps> = ({
  to,
  from,
  autoRouterInfo,
}) => {
  return (
    <AutoRouterWrapper>
      <div className="row">
        <img src={from.tokenLogo} alt="token logo" className="token-logo" />
        <div className="left-box">
          <div className="left-badge">V1</div>
          <span>{autoRouterInfo.v1fee[0]}</span>
        </div>
        <DotLine />
        <div className="pair-fee">
          <div className="coin-logo">
            <div className="from">
              <img src={from.tokenLogo} alt="pair-logo" className="pair-logo" />
            </div>
            <div className="to">
              <img src={to.tokenLogo} alt="pair-logo" className="pair-logo" />
            </div>
          </div>
          <h1>{autoRouterInfo.v1fee[1]}</h1>
        </div>
        <DotLine />
        <div className="pair-fee">
          <div className="coin-logo">
            <div className="from">
              <img src={from.tokenLogo} alt="pair-logo" className="pair-logo" />
            </div>
            <div className="to">
              <IconLogoPrimary className="pair-logo" />
            </div>
          </div>
          <h1>{autoRouterInfo.v1fee[2]}</h1>
        </div>
        <DotLine />
        <div className="image-wrap">
          <IconLogoPrimary className="token-logo" />
        </div>
      </div>
      <div className="row">
        <img src={from.tokenLogo} alt="token logo" className="token-logo" />
        <div className="left-box">
          <div className="left-badge">V1</div>
          <span>{autoRouterInfo.v2fee[0]}</span>
        </div>
        <DotLine />
        <div className="pair-fee">
          <div className="coin-logo">
            <div className="from">
              <img src={from.tokenLogo} alt="pair-logo" className="pair-logo" />
            </div>
            <div className="to">
              <IconLogoPrimary className="pair-logo" />
            </div>
          </div>
          <h1>{autoRouterInfo.v2fee[1]}</h1>
        </div>
        <DotLine />
        <div className="image-wrap">
          <IconLogoPrimary className="token-logo" />
        </div>
      </div>
      <div className="row">
        <img src={from.tokenLogo} alt="token logo" className="token-logo" />
        <div className="left-box">
          <div className="left-badge">V1</div>
          <span>{autoRouterInfo.v3fee[0]}</span>
        </div>
        <DotLine />
        <div className="pair-fee">
          <div className="coin-logo">
            <div className="from">
              <img src={from.tokenLogo} alt="pair-logo" className="pair-logo" />
            </div>
            <div className="to">
              <IconLogoPrimary className="pair-logo" />
            </div>
          </div>
          <h1>{autoRouterInfo.v3fee[1]}</h1>
        </div>
        <DotLine />
        <div className="image-wrap">
          <IconLogoPrimary className="token-logo" />
        </div>
      </div>
      <p className="gas-description">
        Best price route costs ~$0.58 in gas. This route optimizes your total
        output by considering split routes, multiple hops, and the gas cost of
        each step.
      </p>
    </AutoRouterWrapper>
  );
};

export default SwapCardAutoRouter;
