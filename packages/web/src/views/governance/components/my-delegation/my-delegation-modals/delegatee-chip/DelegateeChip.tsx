import React from "react";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { DelegateeInfo } from "@repositories/governance";

import { DelegateeChipWrapper } from "./DelegateeChip.styles";

interface GovernanceDetailProps {
  delegatee: DelegateeInfo;
  selected: boolean;
  onClick: () => void;
  showLogo? : boolean;
}

const DelegateeChip: React.FC<GovernanceDetailProps> = ({
  delegatee,
  selected,
  onClick,
  showLogo = true,
}) => {
  return (
    <DelegateeChipWrapper
      className={[selected ? "selected" : "", showLogo ? "" : "no-logo"].join(
        " ",
      )}
      onClick={onClick}
    >
      {showLogo && (
        <MissingLogo
          symbol={delegatee.name}
          url={delegatee.logoUrl}
          width={24}
        />
      )}
      {delegatee.name}
    </DelegateeChipWrapper>
  );
};

export default DelegateeChip;
