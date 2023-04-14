import React from "react";
import StakingContentCard from "@components/pool/staking-content-card/StakingContentCard";
import { wrapper } from "./StakingContent.styles";

interface StakingContentProps {
  content: any[];
}

const StakingContent: React.FC<StakingContentProps> = ({ content }) => {
  return (
    <div css={wrapper}>
      {content.map((item, idx) => (
        <StakingContentCard item={item} key={idx} />
      ))}
    </div>
  );
};

export default StakingContent;
