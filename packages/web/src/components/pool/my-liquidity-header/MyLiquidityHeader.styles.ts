import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const HeaderWrapper = styled.div`
  ${mixins.flexbox("row", "flex-end", "space-between")};
  width: 100%;
  ${fonts.h5};
  color: ${({ theme }) => theme.color.text02};

  ${media.mobile} {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    justify-content: flex-start;
    ${fonts.h6};
  }

  .button-wrap {
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    gap: 8px;
    ${media.mobile} {
      width: 100%;
      button {
        width: 50%;
      }
    }
  }
`;
