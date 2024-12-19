import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const DecreasePoolInfoWrapper = styled.div`
  padding: 15px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background: ${({ theme }) => theme.color.background20};
  gap: 16px;
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  .box-info {
    width: 100%;
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    .value {
      width: 100%;
      ${mixins.flexbox("row", "center", "space-between")};
      > div {
        ${mixins.flexbox("row", "center", "center")};
        gap: 5px;
        > p {
          color: ${({ theme }) => theme.color.text03};
          ${fonts.body12}
          white-space: nowrap;
        }
      }
      > p {
        color: ${({ theme }) => theme.color.text03};
        ${fonts.body12}
        white-space: nowrap;
      }
      .protocol-fee {
        color: ${({ theme }) => theme.color.text04};
        &:first-of-type {
          ${mixins.flexbox("row", "center", "center")};
          gap: 4px;
        }
        svg {
          width: 16px;
          height: 16px;
          * {
            fill: ${({ theme }) => theme.color.icon03};
          }
        }
      }
    }
    .usd {
      color: ${({ theme }) => theme.color.text04};
      ${fonts.p4}
      text-align: right;
      width: 100%;
    }
  }
`;

export const GnotCollectSwitchWrapper = styled.div`
  width: 100%;
  ${mixins.flexbox("row", "center", "space-between")}
  ${fonts.body12}
`;
