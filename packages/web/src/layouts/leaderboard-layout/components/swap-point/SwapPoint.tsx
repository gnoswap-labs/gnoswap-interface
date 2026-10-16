import React from "react";
import { useTranslation } from "react-i18next";

import Tooltip from "@components/common/tooltip/Tooltip";
import WarningCard from "@components/common/warning-card/WarningCard";
import { formatLeaderboardPoint, isSwapCapReached } from "@utils/leaderboard-utils";
import { formatPrice } from "@utils/new-number-utils";
import { ContentWrapper, Counted, Flex, FontWeight500, Label, Wrapper } from "./SwapPoint.styles";

interface SwapPointProps {
  swapPoint: string | undefined;
  swapRawPoint: string | undefined;
  swapCapPoint: string | undefined;
  swapFeeUsd: string | undefined;
}

const SwapPoint = ({ swapPoint, swapRawPoint, swapCapPoint, swapFeeUsd }: SwapPointProps) => {
  const { t } = useTranslation();
  const capReached = isSwapCapReached(swapRawPoint, swapCapPoint);

  return (
    <Tooltip
      placement="top"
      FloatingContent={
        <Wrapper>
          <ContentWrapper>
            <Flex>
              <Label>{t("Leaderboard:list.column.swapFeesPaid")}</Label>
              <FontWeight500>{formatPrice(swapFeeUsd, { isKMB: false, approx: true, lessThan1Significant: 2 })}</FontWeight500>
            </Flex>
            <Flex>
              <Label>{t("Leaderboard:list.column.swapRaw")}</Label>
              <FontWeight500>{formatLeaderboardPoint(swapRawPoint)}</FontWeight500>
            </Flex>
            <Flex>
              <Label>{t("Leaderboard:list.column.swapCap")}</Label>
              <FontWeight500>{formatLeaderboardPoint(swapCapPoint)}</FontWeight500>
            </Flex>
            <Flex>
              <Label>{t("Leaderboard:list.column.counted")}</Label>
              <Counted $highlighted={capReached}>{formatLeaderboardPoint(swapPoint)}</Counted>
            </Flex>
          </ContentWrapper>
          {capReached && (
            <WarningCard hasBorder={false} content={<p>{t("Leaderboard:list.column.swapCapWarning")}</p>} />
          )}
        </Wrapper>
      }
    >
      <span>{formatLeaderboardPoint(swapPoint)}</span>
    </Tooltip>
  );
};

export default SwapPoint;
