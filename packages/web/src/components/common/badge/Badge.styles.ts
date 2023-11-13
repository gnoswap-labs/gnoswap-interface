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
  .content {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 5px;
  }
  ${({ type, theme }) => {
    if (type === BADGE_TYPE.LINE)
      return css`
        background-color: ${theme.color.background03};
        border: 1px solid ${theme.color.point};
        color: ${theme.color.point};
      `;
    if (type === BADGE_TYPE.PRIMARY)
      return css`
        background-color: ${theme.color.background04};
        color: ${theme.color.text06};
      `;
    if (type === BADGE_TYPE.LIGHT_DEFAULT)
      return css`
        background-color: ${theme.color.background08};
        border: 1px solid ${theme.color.border07};
        color: ${theme.color.text05};
      `;
    if (type === BADGE_TYPE.DARK_DEFAULT)
      return css`
        background-color: ${theme.color.backgroundOpacity3};
        border: 1px solid ${theme.color.border08};
        color: ${theme.color.text12};
      `;
    return css`
      background-color: ${theme.color.background03};
      border: 1px solid ${theme.color.border03};
      color: ${theme.color.text03};
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
