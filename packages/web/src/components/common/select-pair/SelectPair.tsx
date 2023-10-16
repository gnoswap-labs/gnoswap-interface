import React from "react";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import { SelectPairWrapper } from "./SelectPair.styles";
import { TokenModel } from "@models/token/token-model";

interface SelectPairProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  changeTokenA: (token: TokenModel) => void;
  changeTokenB: (token: TokenModel) => void;
  disabled?: boolean;
}

const SelectPair: React.FC<SelectPairProps> = ({
  tokenA,
  tokenB,
  changeTokenA,
  changeTokenB,
  disabled,
}) => {

  return (
    <SelectPairWrapper>
      <SelectPairButton disabled={disabled} token={tokenA} changeToken={changeTokenA} />
      <SelectPairButton disabled={disabled} token={tokenB} changeToken={changeTokenB} />
    </SelectPairWrapper>
  );
};

export default SelectPair;
