import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

interface WrapperProps {
  opened: boolean;
}

export const DetailWrapper = styled.div<WrapperProps>`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  border-radius: ${({ opened }) => {
    return opened ? "8px 8px 0px 0px" : "8px";
  }};
  background: ${({ theme }) => theme.color.background01};
  border: 1px solid ${({ theme }) => theme.color.border02};

  .exchange-section {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    padding: 16px;
    gap: 16px;
    align-self: stretch;

    ${media.mobile} {
      padding: 12px;
      gap: 12px;
    }
    .exchange-container {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      align-self: stretch;
      ${fonts.body12};
      color: ${({ theme }) => theme.color.text03};
      .ocin-info {
        ${mixins.flexbox("row", "center", "flex-start")};
        gap: 4px;
        ${media.mobile} {
          ${fonts.p2};
        }
        .exchange-price {
          color: ${({ theme }) => theme.color.text04};
        }
        .icon-info {
          width: 16px;
          height: 16px;
          * {
            fill: ${({ theme }) => theme.color.icon05};
          }
        }
      }
      .price-info {
        ${mixins.flexbox("row", "center", "flex-start")};
        color: ${({ theme }) => theme.color.text04};
        ${fonts.body12};
        gap: 4px;
        .price-icon {
          cursor: pointer;
          width: 16px;
          height: 16px;
          * {
            fill: ${({ theme }) => theme.color.icon03};
          }
        }
      }
    }
  }
`;

export const FeelWrapper = styled.div<WrapperProps>`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  border-radius: ${({ opened }) => {
    return opened ? "0px 0px 8px 8px" : "8px";
  }};
  background: ${({ theme }) => theme.color.background01};
  border-left: 1px solid ${({ theme }) => theme.color.border02};
  border-right: 1px solid ${({ theme }) => theme.color.border02};
  border-bottom: 1px solid ${({ theme }) => theme.color.border02};
  margin-top: -2px;
  .fee-section {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    padding: 0px 16px 16px 16px;
    gap: 16px;
    align-self: stretch;

    ${media.mobile} {
      padding: 12px;
      gap: 12px;
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
