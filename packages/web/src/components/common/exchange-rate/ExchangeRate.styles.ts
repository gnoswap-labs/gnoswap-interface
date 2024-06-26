import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const ExchangeRateWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "flex-start")};
  > span {
    ${fonts.p7}
    margin-top: 8px;
  }
`;
