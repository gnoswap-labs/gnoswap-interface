import { css } from "@emotion/react";
import React from "react";
import TokenWidgetList from "@components/home/token-widget-list/TokenWidgetList";

interface TrendingTokenWidgetProps {}

const TrendingTokenWidget: React.FC<TrendingTokenWidgetProps> = () => {
  return (
    <div
      css={css`
        border: 1px solid orange;
      `}
    >
      <h2>Trending</h2>
      <TokenWidgetList />
    </div>
  );
};

export default TrendingTokenWidget;
