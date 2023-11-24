import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import { CSSProperties } from "react";
interface SkeletonStyleProps {
  tdWidth?: CSSProperties["width"];
}

export const RecentlyAddedCardListwrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "center")}
  width: 100%;
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 16px 0px 12px;
  gap: 12px;

  ${media.mobile} {
    padding: 16px 0px;
    gap: 16px;
  }
  h2 {
    ${mixins.flexbox("row", "center", "center")}
    ${fonts.body9};
    font-weight: 600;
    gap: 10px;
    color: ${({ theme }) => theme.color.text02};
    padding: 0px 24px 0px 20px;
    ${media.tablet} {
      padding: 0px 16px 0px 16px;
    }
  }

  .icon-clock {
    width: 25px;
    height: 25px;
  }
`;

export const SkeletonItem = styled.div<SkeletonStyleProps>`
  width: ${({ tdWidth }) => `${tdWidth}`};
  height: 100%;
  padding: 4px 24px;
  ${mixins.flexbox("row", "center", "flex-start")};
  &:first-of-type {
    padding: 0px 24px 1px 24px;
  }
`;
