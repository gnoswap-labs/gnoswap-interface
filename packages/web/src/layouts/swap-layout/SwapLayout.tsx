import React from "react";
import { SwapLayoutWrapper } from "./SwapLayout.styles";

interface SwapLayoutProps {
  header: React.ReactNode;
  swap: React.ReactNode;
  liquidity: React.ReactNode;
  footer: React.ReactNode;
}

const SwapLayout: React.FC<SwapLayoutProps> = ({
  header,
  swap,
  liquidity,
  footer,
}) => (
  <SwapLayoutWrapper>
    {header}
    <div className="swap-section">
      <div className="swap-container">
        <div className="page-name">Swap</div>
        <div className="right-container">
          <div className="swap">{swap}</div>
          <div className="liquidity">{liquidity}</div>
        </div>
      </div>
    </div>
    {footer}
  </SwapLayoutWrapper>
);

export default SwapLayout;
