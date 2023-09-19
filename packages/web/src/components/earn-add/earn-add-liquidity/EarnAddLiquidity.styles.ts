import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const EarnAddLiquidityWrapper = styled.section`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 24px;
  color: ${({ theme }) => theme.color.text02};
  width: 500px;
  height: 100%;
  background-color: ${({ theme }) => theme.color.background06};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  box-shadow: 10px 14px 60px rgba(0, 0, 0, 0.4);
  padding: 23px;

  .select-content {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    gap: 4px;
  }

  .selector-wrapper {
    ${mixins.flexbox("column", "flex-start", "center")};
    width: 100%;
    background-color: ${({ theme }) => theme.color.backgroundOpacity};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    padding: 15px;
    gap: 16px;

    .header-wrapper {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      height: 24px;
      cursor: pointer;

      h5 {
        ${fonts.body12};
        color: ${({ theme }) => theme.color.text05};
      }
    }
  }

  .setting-button {
    width: 24px;
    height: 24px;

    .setting-icon * {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }
`;
