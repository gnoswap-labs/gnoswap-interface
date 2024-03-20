import styled from "@emotion/styled";
import { media } from "@styles/media";

export const FontSize = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 20.8px;

  ${media.tablet} {
    font-size: 14px;
    font-weight: 400;
    line-height: 18.2px;
  }

  ${media.mobile} {
    font-size: 12px;
    font-weight: 400;
    line-height: 15.6px;
  }
`;
