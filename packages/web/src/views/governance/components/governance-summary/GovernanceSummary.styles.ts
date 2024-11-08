import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const GovernanceSummaryWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  gap: 22px;

  > .info-wrapper {
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    width: 100%;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.color.background06};
    border: 1px solid ${({ theme }) => theme.color.border02};
    @media (max-width: 968px) {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
    }
    ${media.mobile} {
      flex-direction: column;
    }
    .value-wrapper,
    .value-wrapper-for-hover {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 0px;
    }
    .value-wrapper-for-hover {
      &:hover {
        color: ${({ theme }) => theme.color.text07};
        cursor: default;
      }
    }
  }

  > .link-button {
    ${mixins.flexbox("row", "center", "center")};
    width: 100%;
    ${fonts.body11};
    gap: 4px;
    color: ${({ theme }) => theme.color.text04};
    ${media.mobile} {
      ${fonts.p3};
      flex-direction: column;
    }
    a {
      display: block;
      ${mixins.flexbox("row", "center", "center")};
      color: ${({ theme }) => theme.color.text07};
      &:hover {
        color: ${({ theme }) => theme.color.text08};
        svg {
          * {
            fill: ${({ theme }) => theme.color.icon14};
          }
        }
      }
    }
    svg {
      width: 16px;
      height: 16px;
      * {
        fill: ${({ theme }) => theme.color.text07};
      }
    }
    ${media.mobile} {
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
  }
`;

export const GovernanceSummaryTooltipContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 300px;
  ${fonts.body12};
  gap: 8px;
  .row {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    gap: 8px;
    width: 100%;
    .label,
    .value {
      ${mixins.flexbox("row", "center", "space-between")};
    }
    .label {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      font-size: 14px;
      font-weight: 400;
      color: ${({ theme }) => theme.color.text04};
    }
    .value {
      width: 100%;
      padding: 4px 0;
      .key {
        ${mixins.flexbox("row", "center", "flex-start")};
        gap: 8px;
      }
    }
  }
  .divider {
    border-top: 1px solid ${({ theme }) => theme.color.border01};
  }
`;
