import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const GovernanceDetailInfoWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  padding: 24px 36px;
  gap: 16px;
  &:nth-of-type(1),
  &:nth-of-type(2) {
    padding: 24px 0 24px 36px;
    min-width: 275px;
  }
  @media (max-width: 1180px) {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    padding: 24px;

    &:nth-of-type(1),
    &:nth-of-type(2) {
      min-width: 258px;
    }
  }
  @media (max-width: 968px) {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    &:nth-of-type(1),
    &:nth-of-type(2) {
      padding: 12px;
    }
    padding: 12px;
  }
  ${media.mobile} {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    padding: 12px;
    gap: 8px;
  }

  & + & {
    border-left: 1px solid ${({ theme }) => theme.color.border02};
  }

  .title-wrapper {
    ${mixins.flexbox("row", "center", "center")};
    gap: 4px;
    flex-shrink: 0;

    .title {
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
    ${mixins.flexbox("row", "flex-end", "flex-start")};
    @media (max-width: 968px) {
      width: 100%;
      ${mixins.flexbox("row", "flex-end", "flex-end")};
    }
    ${media.mobile} {
      ${mixins.flexbox("row", "flex-end", "flex-start")};
    }
    gap: 8px;
    width: 100%;
    flex-wrap: wrap;
    .currency {
      ${fonts.body6};
      color: ${({ theme }) => theme.color.text04};
    }
    .value {
      display: inline-flex;
      ${fonts.body2};
      color: ${({ theme }) => theme.color.text02};
      ${media.tablet} {
        ${fonts.body4};
      }
      ${media.mobile} {
        ${fonts.body6};
      }
    }
    @media (max-width: 1180px) {
      .value {
        ${fonts.body6};
      }
      .currency {
        ${fonts.body8};
      }
    }
    .button-wrapper {
      flex-shrink: 0;
    }
  }
`;

export const GovernanceDetailInfoTooltipContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: calc(300px - 32px);
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text15};
  background-color: ${({ theme }) => theme.color.background14};
`;
