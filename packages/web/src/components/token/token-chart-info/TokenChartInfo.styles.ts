import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

export const TokenChartInfoWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};

  .token-info-wrapper {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;

    .token-info {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 8px;

      .token-image {
        width: 36px;
        height: 36px;
      }

      .token-name {
        color: ${({ theme }) => theme.color.text02};
        ${fonts.body3};
      }

      .token-symbol {
        color: ${({ theme }) => theme.color.text05};
        ${fonts.body4};
      }
    }

    .price-info {
      .price {
        color: ${({ theme }) => theme.color.text11};
        ${fonts.body1};
      }
    }
  }

  .change-rate-wrapper {
    ${mixins.flexbox("row", "center", "flex-end")};
    width: 100%;
    ${fonts.body10};

    &.up {
      & * {
        color: ${({ theme }) => theme.color.green01};
        fill: ${({ theme }) => theme.color.green01};
      }
    }

    &.down {
      & * {
        color: ${({ theme }) => theme.color.red01};
        fill: ${({ theme }) => theme.color.red01};
      }
    }
  }
`;
