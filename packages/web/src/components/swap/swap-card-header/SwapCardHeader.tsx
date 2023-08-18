import IconLink from "@components/common/icons/IconLink";
import IconSettings from "@components/common/icons/IconSettings";
import React from "react";
import { SwapCardHeaderWrapper } from "./SwapCardHeader.styles";

const SwapCardHeader: React.FC = () => {
  return (
    <SwapCardHeaderWrapper>
      <h2>Swap</h2>
      <div className="button-wrap">
        <IconLink className="setting-icon" />
        <IconSettings className="setting-icon" />
      </div>
    </SwapCardHeaderWrapper>
  );
};

export default SwapCardHeader;
