import React from "react";
import IconStrokeArrowDown from "../icons/IconStrokeArrowDown";
import { wrapper } from "./SelectTokenBadge.styles";

interface SelectTokenBadgeProps {
  token: any;
  hasArrow?: boolean;
  isSelectable?: boolean;
  onClick?: () => void;
}

const dummyData = {
  tokenLogo:
    "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  symbol: "HEX",
};

const SelectTokenBadge: React.FC<SelectTokenBadgeProps> = ({
  token = dummyData,
  hasArrow = false,
  isSelectable = true,
  onClick,
}) => {
  return (
    <div css={wrapper(isSelectable, hasArrow)} onClick={onClick}>
      <img src={token.tokenLogo} alt="token-logo" />
      <span className="symbol">{token.symbol}</span>
      {hasArrow && <IconStrokeArrowDown />}
    </div>
  );
};

export default SelectTokenBadge;
