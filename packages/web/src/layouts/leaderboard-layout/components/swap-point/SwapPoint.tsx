import React from "react";
import { useTranslation } from "react-i18next";

import Tooltip from "@components/common/tooltip/Tooltip";
import { formatLeaderboardPoint } from "@utils/leaderboard-utils";
import { ContentWrapper, Description, Flex, FontWeight500, Label, Wrapper } from "./SwapPoint.styles";

interface SwapPointProps {
  swapPoint: string | undefined;
  swapCapPoint: string | undefined;
}

const SwapPoint = ({ swapPoint, swapCapPoint }: SwapPointProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip
      placement="top"
      FloatingContent={
        <Wrapper>
          <ContentWrapper>
            <Flex>
              <Label>{t("Leaderboard:list.column.swapCap")}</Label>
              <FontWeight500>{formatLeaderboardPoint(swapCapPoint)}</FontWeight500>
            </Flex>
          </ContentWrapper>
          <Description>{t("Leaderboard:list.column.tooltip.swapCap")}</Description>
        </Wrapper>
      }
    >
      <span>{formatLeaderboardPoint(swapPoint)}</span>
    </Tooltip>
  );
};

export default SwapPoint;
