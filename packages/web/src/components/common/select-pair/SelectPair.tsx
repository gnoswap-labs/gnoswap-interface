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
    <SelectPairWrapper isTokenA={!!tokenA} isTokenB={!!tokenB}>
      <SelectPairButton className={tokenA ? "change-select-pair-A" : ""} disabled={disabled} token={tokenA} changeToken={changeTokenA} />
      <SelectPairButton className={tokenB ? "change-select-pair-B" : ""} disabled={disabled} token={tokenB} changeToken={changeTokenB} />
    </SelectPairWrapper>
  );
};

export default SelectPair;
