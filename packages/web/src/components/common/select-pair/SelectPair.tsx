import React from "react";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import { SelectPairWrapper } from "./SelectPair.styles";
import { TokenDefaultModel } from "@models/token/token-default-model";

interface SelectPairProps {
  token0: TokenDefaultModel | undefined;
  token1: TokenDefaultModel | undefined;
  changeToken0: (token: TokenDefaultModel) => void;
  changeToken1: (token: TokenDefaultModel) => void;
  disabled?: boolean;
}

const SelectPair: React.FC<SelectPairProps> = ({
  token0,
  token1,
  changeToken0,
  changeToken1,
  disabled,
}) => {

  return (
    <SelectPairWrapper>
      <SelectPairButton disabled={disabled} token={token0} changeToken={changeToken0} />
      <SelectPairButton disabled={disabled} token={token1} changeToken={changeToken1} />
    </SelectPairWrapper>
  );
};

export default SelectPair;
