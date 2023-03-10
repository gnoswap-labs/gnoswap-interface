import { css } from "@emotion/react";
import React from "react";

const HomeSwap: React.FC = () => {
  return (
    <div
      css={css`
        border: 1px solid blue;
      `}
    >
      <button>Swap now</button>
    </div>
  );
};

export default HomeSwap;
