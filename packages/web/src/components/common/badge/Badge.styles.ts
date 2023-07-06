import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { BADGE_TYPE } from "./Badge";
import { css } from "@emotion/react";
import { fonts } from "@constants/font.constant";
interface BadgeStyle {
  type: BADGE_TYPE;
}

export const BadgeWrapper = styled.div<BadgeStyle>`
  ${mixins.flexbox("row", "center", "center", false)};
  ${fonts.p3};
  height: 24px;
  border-radius: 4px;
  padding: 0px 6px;
  ${({ type, theme }) => {
    if (type === BADGE_TYPE.LINE)
      return css`
        background-color: ${theme.colors.opacityDark05};
        border: 1px solid ${theme.colors.colorPoint};
        color: ${theme.colors.colorPoint};
      `;
    if (type === BADGE_TYPE.PRIMARY)
      return css`
        background-color: ${theme.colors.colorPoint};
        border: 1px solid ${theme.colors.brand50};
        color: ${theme.colors.brand10};
      `;
    if (type === BADGE_TYPE.LIGHT_DEFAULT)
      return css`
        background-color: ${theme.colors.opacityDark04};
        border: 1px solid ${theme.colors.gray10};
        color: ${theme.colors.gray30};
      `;
    if (type === BADGE_TYPE.DARK_DEFAULT)
      return css`
        background-color: ${theme.colors.opacityDark05};
        border: 1px solid ${theme.colors.gray40};
        color: ${theme.colors.gray20};
      `;
    return css`
      background-color: ${theme.colors.opacityDark05};
      border: 1px solid ${theme.colors.gray40};
      color: ${theme.colors.gray20};
    `;
  }};

  .badge-icon {
    ${mixins.flexbox("row", "center", "center", false)};
    margin-right: 4px;
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;
