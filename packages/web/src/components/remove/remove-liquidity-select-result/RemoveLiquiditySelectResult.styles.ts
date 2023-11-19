import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";

import styled from "@emotion/styled";
import { media } from "@styles/media";

export const RemoveLiquiditySelectResultWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  gap: 4px;
  width: 100%;
  color: ${({ theme }) => theme.color.text03};
  ${fonts.body12};
  border-top: 1px solid ${({ theme }) => theme.color.border02};
  padding-top: 16px;

  ul,
  .total-section {
    width: 100%;
    padding: 15px;
    background-color: ${({ theme }) => theme.color.background20};
    border: 1px solid ${({ theme }) => theme.color.border02};
    border-radius: 8px;
    ${media.mobile} {
      padding: 11px;
      gap: 8px;
    }
  }

  ul {
    ${mixins.flexbox("column", "center", "center")};
    gap: 16px;
    ${media.mobile} {
      gap: 8px;
    }
  }

  li {
    width: 100%;
    height: 39px;
    ${mixins.flexbox("column", "flex-end", "center")};
    gap: 3px;
    .main-info {
      width: 100%;
      height: 24px;
      ${mixins.flexbox("row", "center", "center")};

      img {
        width: 24px;
        height: 24px;
      }
      p {
        margin-left: 5px;
      }
      strong {
        margin-left: auto;
      }
    }

    .dallor {
      ${fonts.p4}
      color: ${({ theme }) => theme.color.text04}
    }
  }

  .total-section {
    ${mixins.flexbox("row", "center", "space-between")};
    h5 {
      ${fonts.body10};
      color: ${({ theme }) => theme.color.text04}
    }
    
    .total-value {
      ${fonts.body12}
      color: ${({ theme }) => theme.color.text02}
    }
    ${media.mobile} {
      h5 {
        ${fonts.body12};
      }
s    }
  }
`;
