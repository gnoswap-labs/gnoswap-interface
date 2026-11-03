import React from "react";
import { useTranslation } from "react-i18next";

import Tooltip from "@components/common/tooltip/Tooltip";
import { formatLeaderboardPoint } from "@utils/leaderboard-utils";
import { ContentWrapper, Flex, FontWeight500, FrontWeight, Label, Title, Wrapper } from "./PointComposition.styles";

export interface PointCompositionItem {
  // i18n key of the row label.
  label: string;
  point: string | undefined;
}

interface PointCompositionProps {
  totalPoint: string;
  items: PointCompositionItem[];
  // Global cap ratio of the round, or null when it cannot be derived.
  globalCapRatio: string | null;
  isProvisional: boolean;
  isMobile: boolean;
}

const PointComposition = ({ totalPoint, items, globalCapRatio, isProvisional, isMobile }: PointCompositionProps) => {
  const { t } = useTranslation();

  const displayGlobalCapRatio = React.useMemo(() => {
    if (!globalCapRatio) return "-";
    if (!isProvisional) return globalCapRatio;
    return `${globalCapRatio} (${t("Leaderboard:list.column.provisional")})`;
  }, [globalCapRatio, isProvisional, t]);

  return (
    <Tooltip
      placement="top"
      FloatingContent={
        <Wrapper>
          {!isMobile && <Title>Point Composition</Title>}
          <ContentWrapper>
            {items.map(item => {
              return (
                <Flex key={item.label}>
                  <Label>{t(item.label)}</Label>
                  <FontWeight500>{formatLeaderboardPoint(item.point)}</FontWeight500>
                </Flex>
              );
            })}
            <Flex>
              <Label>{t("Leaderboard:list.column.globalCapRatio")}</Label>
              <FontWeight500>{displayGlobalCapRatio}</FontWeight500>
            </Flex>
            <Flex>
              <Label>{t("Leaderboard:list.column.total")}</Label>
              <FontWeight500>{formatLeaderboardPoint(totalPoint)}</FontWeight500>
            </Flex>
          </ContentWrapper>
        </Wrapper>
      }
    >
      <FrontWeight>{formatLeaderboardPoint(totalPoint)}</FrontWeight>
    </Tooltip>
  );
};

export default PointComposition;
