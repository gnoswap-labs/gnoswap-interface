import React from "react";
import StakingContent from "@components/pool/staking-content/StakingContent";
import StakingHeader from "@components/pool/staking-header/StakingHeader";
import { wrapper } from "./Staking.styles";

interface StakingProps {
  info: any;
}

const Staking: React.FC<StakingProps> = ({ info }) => {
  return (
    <div css={wrapper}>
      <StakingHeader />
      <StakingContent content={info} />
    </div>
  );
};

export default Staking;
