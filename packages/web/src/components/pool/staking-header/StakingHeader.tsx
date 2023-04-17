import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React from "react";
import { wrapper } from "./StakingHeader.styles";

interface StakingHeaderProps {}

const StakingHeader: React.FC<StakingHeaderProps> = ({}) => {
  return (
    <div css={wrapper}>
      <h2>Staking</h2>
      <div className="button-wrap">
        <Button
          text="Unstake"
          onClick={() => {}}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            height: 36,
            padding: "0px 16px",
            fontType: "p1",
          }}
        />
        <Button
          text="Stake"
          onClick={() => {}}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            height: 36,
            padding: "0px 16px",
            fontType: "p1",
          }}
        />
      </div>
    </div>
  );
};

export default StakingHeader;
