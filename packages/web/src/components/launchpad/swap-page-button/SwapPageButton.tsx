import React from "react";

import IconChevronRight from "@components/common/icons/IconChevronRight";
import { SwapPageButtonWrapper } from "./SwapPageButton.styles";

const SwapPageButton = ({
  className,
  onClick,
  disabled = false,
}: {
  className?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}) => {
  return (
    <SwapPageButtonWrapper
      className={className ? className : ""}
      onClick={onClick}
      disabled={disabled}
    >
      <span>Swap</span>
      <IconChevronRight />
    </SwapPageButtonWrapper>
  );
};

export default SwapPageButton;
