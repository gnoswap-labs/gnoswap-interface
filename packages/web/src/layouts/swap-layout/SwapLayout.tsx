import React from "react";
import { wrapper } from "./SwapLayout.styles";

interface SwapLayoutProps {
  header: React.ReactNode;
  swap: React.ReactNode;
  footer: React.ReactNode;
}

const SwapLayout: React.FC<SwapLayoutProps> = ({ header, swap, footer }) => (
  <div css={wrapper}>
    {header}

    <div className="container">
      <div className="page-name">Swap</div>
      <div className="swap">{swap}</div>
      <div className="empty" />
    </div>

    {footer}
  </div>
);

export default SwapLayout;
