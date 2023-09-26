import React from "react";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import { SelectPairWrapper } from "./SelectPair.styles";
import { TokenInfo } from "@models/token/token-info";

interface SelectPairProps {
  tokenA: TokenInfo | undefined;
  tokenB: TokenInfo | undefined;
  changeToken0: (token: TokenInfo) => void;
  changeToken1: (token: TokenInfo) => void;
  disabled?: boolean;
}

const SelectPair: React.FC<SelectPairProps> = ({
  tokenA,
  tokenB,
  changeToken0,
  changeToken1,
  disabled,
}) => {

  return (
    <SelectPairWrapper>
      <SelectPairButton disabled={disabled} token={tokenA} changeToken={changeToken0} />
      <SelectPairButton disabled={disabled} token={tokenB} changeToken={changeToken1} />
    </SelectPairWrapper>
  );
};

export default SelectPair;
