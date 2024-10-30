import React from "react";
import { useTranslation } from "react-i18next";

import IconStrokeArrowUp from "@components/common/icons/IconStrokeArrowUp";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import { ShowMoreWrapper } from "./LaunchpadShowMoreButton.styles";

interface ShowMoreProps {
  show: boolean;
  onClick: () => void;
}

const LaunchpadShowMoreButton = ({ show, onClick }: ShowMoreProps) => {
  const { t } = useTranslation();

  return (
    <ShowMoreWrapper onClick={onClick}>
      <span>
        {show
          ? t("Launchpad:common.button.showLess")
          : t("Launchpad:common.button.showMore")}
      </span>
      {show ? (
        <IconStrokeArrowUp className="icon-load" />
      ) : (
        <IconStrokeArrowDown className="icon-load" />
      )}
    </ShowMoreWrapper>
  );
};

export default LaunchpadShowMoreButton;
