import React from "react";
import { CONTENT_TITLE } from "@components/incentivize/pool-incentivize/PoolIncentivize";
import { wrapper } from "./Disclaimer.styles";

interface DisclaimerProps {
  disclaimer: string;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ disclaimer }) => {
  return (
    <div css={wrapper}>
      <h5 className="section-title">{CONTENT_TITLE.DISCLAIMER}</h5>
      <div className="desc">{disclaimer}</div>
    </div>
  );
};

export default Disclaimer;
