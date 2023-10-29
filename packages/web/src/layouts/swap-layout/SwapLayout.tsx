import React from "react";
import { SwapLayoutWrapper } from "./SwapLayout.styles";
import { useAtom } from "jotai";
import { SwapState } from "@states/index";

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
}) => {
  const [swapValue] = useAtom(SwapState.swap);

  return (
    <SwapLayoutWrapper>
      {header}
      <div className="swap-section">
        <div className="swap-container">
          <div className="page-name">Swap</div>
          <div className="right-container">
            <div className="swap">{swap}</div>
            <div className="liquidity">
              {swapValue.tokenA && swapValue.tokenB && liquidity}
            </div>
          </div>
        </div>
      </div>
      {footer}
    </SwapLayoutWrapper>
  );
};

export default SwapLayout;
