import React from "react";
import { useTranslation } from "react-i18next";

import Tooltip from "@components/common/tooltip/Tooltip";
import { LeaderboardHoldingDetail } from "@repositories/leaderboard/response/common/types";
import { formatGnsAmount, formatLeaderboardPoint } from "@utils/leaderboard-utils";
import { ContentWrapper, Flex, FontWeight500, Label, Wrapper } from "../point-composition/PointComposition.styles";

interface DelegationPointProps {
  gnsDelegationPoint: string | undefined;
  holdingDetail: LeaderboardHoldingDetail | null | undefined;
}

// Delegation points with a hover on the account's currently delegated GNS.
// Without holding details from the API only the points are shown.
const DelegationPoint = ({ gnsDelegationPoint, holdingDetail }: DelegationPointProps) => {
  const { t } = useTranslation();
  const point = formatLeaderboardPoint(gnsDelegationPoint);

  if (!holdingDetail) {
    return <span>{point}</span>;
  }

  return (
    <Tooltip
      placement="top"
      FloatingContent={
        <Wrapper>
          <ContentWrapper>
            <Flex>
              <Label>{t("Leaderboard:list.column.delegatedGns")}</Label>
              <FontWeight500>{formatGnsAmount(holdingDetail.delegatedGnsAmount)}</FontWeight500>
            </Flex>
            <Flex>
              <Label>{t("Leaderboard:list.column.pointsThisRound")}</Label>
              <FontWeight500>{point}</FontWeight500>
            </Flex>
          </ContentWrapper>
        </Wrapper>
      }
    >
      <span>{point}</span>
    </Tooltip>
  );
};

export default DelegationPoint;
