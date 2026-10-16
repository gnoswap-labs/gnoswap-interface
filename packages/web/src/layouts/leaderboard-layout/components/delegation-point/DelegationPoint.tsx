import React from "react";
import { useTranslation } from "react-i18next";

import Tooltip from "@components/common/tooltip/Tooltip";
import { LeaderboardHoldingDetail } from "@repositories/leaderboard/response/common/types";
import { formatGnsAmount, formatLeaderboardPoint, getGnotValueOfUsd } from "@utils/leaderboard-utils";
import { formatOtherPrice } from "@utils/new-number-utils";
import { ContentWrapper, Flex, FontWeight500, Label, Wrapper } from "../point-composition/PointComposition.styles";

interface DelegationPointProps {
  gnsDelegationPoint: string | undefined;
  holdingDetail: LeaderboardHoldingDetail | null | undefined;
  // Current USD value of the delegated GNS.
  delegatedGnsUsd: string | undefined;
  gnotUsdPrice: string | number | undefined;
}

// Delegation points with a hover on the account's currently delegated GNS and
// its value in GNOT and USD. Without holding details from the API only the
// points are shown.
const DelegationPoint = ({
  gnsDelegationPoint,
  holdingDetail,
  delegatedGnsUsd,
  gnotUsdPrice,
}: DelegationPointProps) => {
  const { t } = useTranslation();
  const point = formatLeaderboardPoint(gnsDelegationPoint);

  const delegatedValue = React.useMemo(() => {
    // Nothing delegated now: no value to show next to the amount.
    if (!holdingDetail || !(Number(holdingDetail.delegatedGnsAmount) > 0)) return "";

    const gnot = getGnotValueOfUsd(delegatedGnsUsd, gnotUsdPrice);
    const values = [
      gnot !== null ? `${formatLeaderboardPoint(gnot)} GNOT` : null,
      delegatedGnsUsd ? `≈ ${formatOtherPrice(delegatedGnsUsd, { isKMB: false })}` : null,
    ].filter(value => value !== null);
    return values.length > 0 ? ` (${values.join(" ")})` : "";
  }, [holdingDetail, delegatedGnsUsd, gnotUsdPrice]);

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
              <FontWeight500>
                {formatGnsAmount(holdingDetail.delegatedGnsAmount)}
                {delegatedValue}
              </FontWeight500>
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
