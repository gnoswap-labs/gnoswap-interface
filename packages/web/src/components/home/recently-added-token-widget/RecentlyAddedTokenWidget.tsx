import { css } from "@emotion/react";
import React from "react";
import TokenWidgetList from "@components/home/token-widget-list/TokenWidgetList";

interface RecentlyAddedTokenWidgetProps {}

const RecentlyAddedTokenWidget: React.FC<
  RecentlyAddedTokenWidgetProps
> = () => {
  return (
    <div
      css={css`
        border: 1px solid orange;
      `}
    >
      <h2>Recently Added</h2>
      <TokenWidgetList />
    </div>
  );
};

export default RecentlyAddedTokenWidget;
