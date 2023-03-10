import { css } from "@emotion/react";
import React from "react";

interface TokenWidgetListProps {}

const TokenWidgetList: React.FC<TokenWidgetListProps> = () => {
  return (
    <div
      css={css`
        border: 1px solid yellow;
      `}
    >
      TokenWidgetList
    </div>
  );
};

export default TokenWidgetList;
