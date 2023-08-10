import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const VolumeChartSelectTabWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  .chart-select-button {
    ${fonts.body10};
    width: 60px;
    height: 37px;
    padding: 0px 8px;
    ${media.mobile} {
      ${fonts.body12};
      padding: 4px 24px;
      height: 26px;
    }
  }
`;
