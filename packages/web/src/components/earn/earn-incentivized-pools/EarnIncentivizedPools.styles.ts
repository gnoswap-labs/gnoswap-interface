import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const PoolsWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  gap: 24px;
  ${fonts.h5};
  ${media.tablet} {
    align-items: flex-start;
  }
  ${media.mobile} {
    gap: 16px;
    ${fonts.h6};
  }

  h2 {
    width: 100%;
    color: ${({ theme }) => theme.color.text02};
    ${mixins.flexbox("row", "center", "flex-start")};
  }
`;
