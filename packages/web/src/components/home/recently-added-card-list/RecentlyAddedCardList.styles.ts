import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import { CSSProperties } from "react";
interface SkeletonStyleProps {
  tdWidth?: CSSProperties["width"];
}

interface Props {
  loading: boolean;
}

export const RecentlyAddedCardListwrapper = styled.div<Props>`
  ${mixins.flexbox("column", "flex-start", "center")}
  width: 100%;
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: ${({ loading }) => {
    return loading ? "15px 0px 15px" : "15px 0px 11px";
  }};
  gap: ${({ loading }) => {
    return loading ? "8px" : "12px";
  }};

  ${media.mobile} {
    padding: 15px 0px;
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
  .header-wrapper {
    width: 100%;
    ${mixins.flexbox("row", "center", "space-between")};
    .link-to-dashboard {
      ${mixins.flexbox("row", "center", "flex-start")};
      margin-right: 24px;
      ${fonts.body11}
      color: ${({ theme }) => theme.color.text04};
      svg {
        width: 18px;
        height: 18px;
      }
      svg * {
        fill: ${({ theme }) => theme.color.icon03};
      }
      &:hover {
        color: ${({ theme }) => theme.color.text10};
        svg * {
          fill: ${({ theme }) => theme.color.icon15};
        }
      }
      ${media.tablet} {
        margin-right: 12px;
      }
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
    padding: 0px 24px 5px 24px;
  }
`;
