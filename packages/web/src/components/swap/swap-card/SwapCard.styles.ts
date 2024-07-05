import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const SwapCardWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  padding: 23px;
  gap: 16px;

  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background: ${({ theme }) => theme.color.background06};
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.08);

  ${media.mobile} {
    padding: 15px;
    gap: 12px;
    align-self: stretch;
  }

  .search-input {
  }

  .footer {
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    position: relative;
    width: 100%;
    button {
      height: 57px;
      span {
        ${fonts.body7}
      }
      ${media.mobile} {
        height: 41px;
        span {
          ${fonts.body9}
        }
      }
    }
  }
  .tooltip {
  }
  button {
    cursor: default;
  }
  .button-swap {
    cursor: pointer;
  }
`;


export const SwapWarningSection = styled.div`
`;

export const HighPriceWarningContentWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "flex-start")};
  gap: 8px;
`;
