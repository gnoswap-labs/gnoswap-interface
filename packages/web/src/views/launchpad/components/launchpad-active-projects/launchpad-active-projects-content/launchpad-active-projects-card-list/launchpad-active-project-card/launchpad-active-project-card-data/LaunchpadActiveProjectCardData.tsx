import React from "react";

import { ActiveProjectCardDataWrapper } from "./LaunchpadActiveProjectCardData.styles";

const LaunchpadActiveProjectCardData = () => {
  return (
    <ActiveProjectCardDataWrapper>
      <div className="data-box">
        <span className="data-title">Pool1</span>
        <span className="data">189.71% APR</span>
        <span className="badge">1 Month</span>
      </div>
      <div className="data-box">
        <span className="data-title">Pool1</span>
        <span className="data">189.71% APR</span>
        <span className="badge">1 Month</span>
      </div>
      <div className="data-box">
        <span className="data-title">Pool1</span>
        <span className="data">189.71% APR</span>
        <span className="badge">1 Month</span>
      </div>
    </ActiveProjectCardDataWrapper>
  );
};

export default LaunchpadActiveProjectCardData;
