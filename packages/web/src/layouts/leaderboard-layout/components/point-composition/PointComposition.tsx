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
  isMobile: boolean;
}

const PointComposition = ({ totalPoint, items, isMobile }: PointCompositionProps) => {
  const { t } = useTranslation();

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
          </ContentWrapper>
        </Wrapper>
      }
    >
      <FrontWeight>{formatLeaderboardPoint(totalPoint)}</FrontWeight>
    </Tooltip>
  );
};

export default PointComposition;
