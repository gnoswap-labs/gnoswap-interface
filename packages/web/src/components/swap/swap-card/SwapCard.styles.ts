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
      ${media.mobile} {
        height: 41px;
      }
    }
  }
  .tooltip {
  }
`;
