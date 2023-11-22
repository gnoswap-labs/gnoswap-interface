import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const PositionsWrapper = styled.div`
  ${mixins.flexbox("row", "flex-end", "space-between")};
  width: 100%;
  color: ${({ theme }) => theme.color.text02};
  ${fonts.h5}
  ${media.mobile} {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    ${fonts.h6}
    gap: 12px;
  }
  .button-wrapper {
    ${mixins.flexbox("row", "center", "flex-end")};
    gap: 8px;
    ${media.mobile} {
      width: 100%;
      button {
        width: 50%;
      }
    }
  }
`;
