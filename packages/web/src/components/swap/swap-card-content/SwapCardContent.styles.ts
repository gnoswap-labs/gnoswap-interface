import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const ContentWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  gap: 2px;
  align-self: stretch;

  .first-section {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    position: relative;
    width: 100%;
    padding: 16px 24px;
    gap: 8px;
    align-self: stretch;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    background: ${({ theme }) => theme.color.background01};
    ${media.mobile} {
      padding: 12px;
    }
  }

  .amount-container {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    align-self: stretch;
    color: ${({ theme }) => theme.color.text02};
  }

  .amount-text {
    width: 100%;
    ${fonts.body1};
    ${media.mobile} {
      ${fonts.body5};
    }
    color: ${({ theme }) => theme.color.text01};
  }

  .button-wrapper {
    ${mixins.flexbox("row", "center", "flex-start")};
    padding: 4px 6px;
    gap: 8px;
    cursor: pointer;
  }
  .amount-info {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    align-self: stretch;
    .price-text,
    .balance-text {
      ${fonts.body12};
      color: ${({ theme }) => theme.color.text10};
    }
  }

  .second-section {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    padding: 16px 24px;
    gap: 8px;
    align-self: stretch;
    border-radius: 8px;
    background: ${({ theme }) => theme.color.background01};
    border: 1px solid ${({ theme }) => theme.color.border02};
    ${media.mobile} {
      padding: 12px;
    }
  }
  .arrow {
    ${mixins.flexbox("row", "center", "center")};
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translate(-50%, -50%);

    width: 100%;
    .shape {
      ${mixins.flexbox("row", "center", "center")};
      width: 40px;
      height: 40px;
      background-color: ${({ theme }) => theme.color.background01};
      border: 1px solid ${({ theme }) => theme.color.border02};
      border-radius: 50%;

      .shape-icon {
        width: 16px;
        height: 16px;
        * {
          fill: ${({ theme }) => theme.color.icon02};
        }
      }
    }
  }
`;

export const SwapDivider = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  height: 1px;
  align-self: stretch;
  background: ${({ theme }) => theme.color.border02};
`;
