import React from "react";

import IconStrokeArrowUp from "@components/common/icons/IconStrokeArrowUp";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import { ShowMoreWrapper } from "./LaunchpadShowMoreButton.styles";

interface ShowMoreProps {
  show: boolean;
  onClick: () => void;
}

const LaunchpadShowMoreButton = ({ show, onClick }: ShowMoreProps) => {
  return (
    <ShowMoreWrapper onClick={onClick}>
      <span>{show ? "Less more" : "Show more"}</span>
      {show ? (
        <IconStrokeArrowUp className="icon-load" />
      ) : (
        <IconStrokeArrowDown className="icon-load" />
      )}
    </ShowMoreWrapper>
  );
};

export default LaunchpadShowMoreButton;
