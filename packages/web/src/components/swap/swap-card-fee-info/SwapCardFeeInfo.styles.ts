import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const FeeWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  padding: 16px 0px 0px 0px;
  gap: 16px;
  align-self: stretch;
  ${fonts.body12};
  ${media.mobile} {
    ${fonts.p2};
  }
  ${media.mobile} {
    padding: 0px;
    gap: 8px;
    flex-direction: column;
  }

  .gray-text {
    color: ${({ theme }) => theme.color.text04};
    &:last-of-type {
      margin-left: 4px;
    }
  }
  .white-text {
    color: ${({ theme }) => theme.color.text10};
  }
  .received,
  .gas-fee,
  .price-impact {
    ${mixins.flexbox("row", "flex-start", "space-between")};
    width: 100%;
    align-self: stretch;
  }
  .auto-router {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    align-self: stretch;
    .auto-wrapper {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 4px;
      svg * {
        fill: ${({ theme }) => theme.color.point};
      }
      h1 {
        background: linear-gradient(90deg, #0059FF -27.22%, #8C8DFC 137.97%);
        -webkit-background-clip: text;
        color: transparent;
      }
    }
    .router-icon {
      cursor: pointer;
      width: 16px;
      height: 16px;
      * {
        fill: ${({ theme }) => theme.color.icon03};
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
