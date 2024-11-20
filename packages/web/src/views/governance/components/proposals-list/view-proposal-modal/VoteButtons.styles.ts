import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const VoteButtonsWrapper = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  width: 100%;
  gap: 2px;
  .vote-button {
    ${mixins.flexbox("column", "center", "center")};
    gap: 8px;
    position: relative;
    padding: 15px 8px;
    border-radius: 8px;
    flex: 1;
    background-color: ${({ theme }) => theme.color.backgroundOpacity2};
    border: 1px solid ${({ theme }) => theme.color.border02};
    span {
      color: ${({ theme }) => theme.color.text10};
      ${fonts.body12}
    }
    > div:first-of-type {
      ${fonts.body4}
      color: ${({ theme }) => theme.color.text02};
    }
    .badge {
      > span {
        color: ${({ theme }) => theme.color.text12};
      }
      position: absolute;
      top: 8px;
      right: 12px;
    }
    ${media.mobile} {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      padding: 12px;
      > div {
        ${fonts.body11}
      }

      > div:first-of-type {
        ${fonts.body12}
      }
    }
    &.use-hover:hover {
      background-color: ${({ theme }) => theme.color.background05Hover};
      border: 1px solid ${({ theme }) => theme.color.border03};
      cursor: pointer;
    }
  }
  .active-button {
    background-color: ${({ theme }) => theme.color.background05Hover};
    border: 1px solid ${({ theme }) => theme.color.border03};
  }
`;
