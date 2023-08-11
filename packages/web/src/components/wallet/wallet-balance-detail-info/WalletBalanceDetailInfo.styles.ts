import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const WalletBalanceDetailInfoWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  padding: 24px 36px;
  gap: 16px;
  ${media.tablet} {
    padding: 24px;
  }
  ${media.mobile} {
    padding: 12px;
    gap: 8px;
  }

  & + & {
    border-left: 1px solid ${({ theme }) => theme.color.border02};
  }

  .title-wrapper {
    ${mixins.flexbox("row", "center", "center")};
    gap: 4px;

    .title {
      ${fonts.body12}
      color: ${({ theme }) => theme.color.text04};
    }
    svg {
      width: 13px;
      height: 13px;
    }
    path {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }

  .value-wrapper {
    ${mixins.flexbox("row", "flex-end", "center")};
    width: 100%;

    ${media.mobile} {
      flex-direction: column;
      gap: 8px;
    }
    .value {
      display: inline-flex;
      width: 100%;
      ${fonts.body2};
      color: ${({ theme }) => theme.color.text02};
      ${media.tablet} {
        ${fonts.body4};
      }
      ${media.mobile} {
        ${fonts.body6};
      }
    }
    .button-wrapper {
      flex-shrink: 0;
    }
  }
`;

export const WalletBalanceDetailInfoTooltipContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: calc(300px - 32px);
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text15};
  background-color: ${({ theme }) => theme.color.background14};
`;
