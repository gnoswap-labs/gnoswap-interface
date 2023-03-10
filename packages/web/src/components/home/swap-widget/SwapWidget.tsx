import { css } from "@emotion/react";
import React from "react";

const SwapWidget: React.FC = () => {
  return (
    <div
      css={css`
        border: 1px solid blue;
      `}
    >
      <h2>SwapWidget</h2>
      <button>Swap now</button>
    </div>
  );
};

export default SwapWidget;
