import React from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <SwapPageButtonWrapper className={className ? className : ""} onClick={onClick} disabled={disabled}>
      <span>{t("Launchpad:common.button.swapPage")}</span>
      <IconChevronRight />
    </SwapPageButtonWrapper>
  );
};

export default SwapPageButton;
