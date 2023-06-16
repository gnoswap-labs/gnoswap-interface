import React from "react";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import { wrapper } from "./SelectPairButton.styles";

interface SelectPairButtonProps {
  token?: any;
  disabled?: boolean;
}

const SelectPairButton: React.FC<SelectPairButtonProps> = ({ token, disabled }) => {
  return (
    <div css={wrapper(Boolean(token), disabled)}>
      {token ? (
        <>
          <img src={token.tokenLogo} alt="token logo" className="token-logo" />
          <span className="token-symbol">{token.symbol}</span>
        </>
      ) : (
        <span>Select</span>
      )}
      <IconStrokeArrowDown className="arrow-icon" />
    </div>
  );
};

export default SelectPairButton;
