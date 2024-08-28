import React from "react";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { TokenModel } from "@models/token/token-model";

import { TokenChipWrapper } from "./TokenChip.styles";

interface GovernanceDetailProps {
  tokenInfo: TokenModel;
}

const TokenChip: React.FC<GovernanceDetailProps> = ({
  tokenInfo,
}) => {
  return (
    <TokenChipWrapper>
      <MissingLogo
        symbol={tokenInfo.symbol}
        url={tokenInfo.logoURI}
        width={24}
      />
      {tokenInfo.symbol}
    </TokenChipWrapper>
  );};

export default TokenChip;
