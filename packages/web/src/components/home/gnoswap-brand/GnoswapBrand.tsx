import { css } from "@emotion/react";
import React from "react";

const GnoswapBrand: React.FC = () => {
  return (
    <div
      css={css`
        border: 1px solid blue;
      `}
    >
      <h2>Swap and Earn on Gnoswap</h2>
      <h3>the One-stop Gnoland Defi Platform</h3>
      <div>sns...</div>
      <p>Gnoswap is an open-source & audited AMM Dex that provides</p>
      <p>
        a simplified concentrated-LP experience for increased capital
        efficiency.
      </p>
    </div>
  );
};

export default GnoswapBrand;
