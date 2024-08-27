import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const GovernanceDetailInfoWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  padding: 31.5px 36px;
  gap: 20px;
  &:nth-of-type(1) {
    padding-right: 0;
    min-width: 275px;
  }
  @media (max-width: 1180px) {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    padding: 24px;

    &:nth-of-type(1) {
      min-width: 258px;
    }
  }
  @media (max-width: 968px) {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    padding: 12px;
    &:nth-of-type(1) {
      min-width: 258px;
      padding-right: 12px;
    }
  }
  ${media.mobile} {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    padding: 12px;
    padding-right: 12px;
    gap: 8px;
  }

  & + & {
    border-left: 1px solid ${({ theme }) => theme.color.border02};
  }

  .title-wrapper {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    gap: 4px;

    @media (max-width: 968px) {
      justify-content: flex-start;
    }

    ${media.mobile} {
      justify-content: space-between;
    }

    .title {
      ${mixins.flexbox("row", "center", "center")};
      gap: 4px;
      flex-shrink: 0;
      ${fonts.body12}
      color: ${({ theme }) => theme.color.text04};
    }

    svg {
      width: 16px;
      height: 16px;
      cursor: default;
    }
    path {
      fill: ${({ theme }) => theme.color.icon03};
    }

    .title-button {
      ${mixins.flexbox("row", "center", "center")};
      ${fonts.body13}
      color: ${({ theme }) => theme.color.text02};
      path {
        fill: ${({ theme }) => theme.color.text02} !important;
      }
      &:hover {
        color: ${({ theme }) => theme.color.text04};
        path {
          fill: ${({ theme }) => theme.color.text04} !important;
        }
      }

      cursor: pointer;
    }
  }

  .value-wrapper-skeleton {
    height: 40px;
    width: 100%;
    ${mixins.flexbox("column", "start", "center")};
    ${media.tablet} {
      height: 31px;
    }

    > span {
      display: block;
      height: 20px;
      width: 150px;
    }
  }

  .value-wrapper {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    gap: 8px;

    .value {
      display: inline-flex;
      ${fonts.body2};
      color: ${({ theme }) => theme.color.text02};

      @media (max-width: 1180px) {
        ${fonts.body6};
      }
      ${media.tablet} {
        ${fonts.body4};
      }
      @media (max-width: 968px) {
        width: 100%;
        ${mixins.flexbox("row", "flex-end", "flex-end")};
      }
      ${media.mobile} {
        ${mixins.flexbox("row", "flex-end", "flex-start")};
        ${fonts.body6};
      }
    }

    .value-button {
      flex-shrink: 0;
      padding: 10px 16px;
    }
  }
`;

export const GovernanceDetailInfoTooltipContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: calc(300px - 32px);
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text15};
`;