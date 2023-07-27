import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const TvlChartSelectTabWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  .chart-select-button {
    ${fonts.body10};
    width: 60px;
    height: 37px;
    padding: 0px 8px;
  }
`;
