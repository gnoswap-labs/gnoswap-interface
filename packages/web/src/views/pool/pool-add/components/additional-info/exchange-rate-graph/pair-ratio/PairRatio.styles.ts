import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const PairRatioWrapper = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  ${fonts.body12}
  gap: 4px;
  text-align: center;
  color: ${({ theme }) => theme.color.text10};
  .icon-wrapper {
    ${mixins.flexbox("row", "center", "center")};
  }
  .ratio-value {
    word-break: break-all; 
  }
  svg {
    cursor: pointer;
    * {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }
  svg:hover * {
    fill: ${({ theme }) => theme.color.icon07};
  }
  .image-logo {
    width: 20px;
    height: 20px;
  }
`;