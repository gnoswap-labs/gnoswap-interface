import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";

export const FaucetTooltip = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  position: absolute;
  top: 60px;
  z-index: ${Z_INDEX.modalTooltip};
  .box {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    max-width: 254px;
    padding: 16px;
    gap: 8px;
    flex-shrink: 0;
    border-radius: 8px;
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text02};
    background-color: ${({ theme }) => theme.color.background02};
  }
  .dark-shadow {
    box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.2);
  }
  .light-shadow {
    box-shadow: 10px 14px 48px 0px rgba(0, 0, 0, 0.12);
  }
  .polygon-icon * {
    fill: ${({ theme }) => theme.color.background02};
    transform: rotate(180deg);
    transform-origin: center center;
  }
`;
