import React from "react";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { VerifiedDelegateInfo } from "@repositories/governance";

import { DelegateeChipWrapper } from "./DelegateeChip.styles";

interface GovernanceDetailProps {
  delegatee: VerifiedDelegateInfo;
  selected: boolean;
  onClick: () => void;
  showLogo?: boolean;
}

const DelegateeChip: React.FC<GovernanceDetailProps> = ({ delegatee, selected, onClick, showLogo = true }) => {
  return (
    <DelegateeChipWrapper
      className={[selected ? "selected" : "", showLogo ? "" : "no-logo"].join(" ")}
      onClick={onClick}
    >
      {showLogo && <MissingLogo symbol={delegatee.name} url={delegatee.logoURL} width={24} />}
      {delegatee.name}
    </DelegateeChipWrapper>
  );
};

export default DelegateeChip;
