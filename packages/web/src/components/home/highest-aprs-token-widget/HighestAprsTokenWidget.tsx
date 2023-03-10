import { css } from "@emotion/react";
import React from "react";
import TokenWidgetList from "@components/home/token-widget-list/TokenWidgetList";

interface HighestAprsTokenWidgetProps {}

const HighestAprsTokenWidget: React.FC<HighestAprsTokenWidgetProps> = () => {
  return (
    <div
      css={css`
        border: 1px solid orange;
      `}
    >
      <h2>Highest APRs</h2>
      <TokenWidgetList />
    </div>
  );
};

export default HighestAprsTokenWidget;
