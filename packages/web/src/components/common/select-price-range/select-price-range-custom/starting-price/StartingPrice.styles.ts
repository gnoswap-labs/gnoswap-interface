import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";

export const StartingPriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  align-self: stretch;

  .title-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    line-height: 22px;

    .sub-title {
      color: ${({ theme }) => theme.color.text04};
      ${fonts.p4}
    }
    .price-info {
      ${mixins.flexbox("row", "center", "center")}
      gap: 2px;
      svg {
        width: 16px;
        height: 16px;
        * {
          fill: ${({ theme }) => theme.color.icon03};
        }
      }
    }
    .description {
      ${mixins.flexbox("row", "center", "center")}
      height: 16px;
      color: ${({ theme }) => theme.color.text04};
      ${fonts.p4}
    }
  }

  .starting-price-input {
    display: flex;
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
    text-align: right;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    background: ${({ theme }) => theme.color.background20};
    ${fonts.body12}
    line-height: 20px;

    &::placeholder {
      color: ${({ theme }) => theme.color.text04};
    }
  }
`;

export const TooltipContentWrapper = styled.div`
  width: 268px;
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text02};
`;
