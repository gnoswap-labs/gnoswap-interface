import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "space-between")};
  > div {
    ${mixins.flexbox("row", "center", "flex-start")};
    width: 170px;
    ${media.mobile} {
      width: 130px;
    }
  }
  ${fonts.body12};
  color: ${theme.color.text02};
  width: 100%;
  height: 36px;
  padding: 0px 24px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${theme.color.hover04};
  }
  img {
    width: 20px;
    height: 20px;
  }
  .missing-logo {
    ${mixins.flexbox("row", "center", "center")};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    color: ${theme.color.text02};
    background-color: ${theme.color.text04};
    ${fonts.p7}
  }
  .name {
    margin: 0px 8px;
  }
  .symbol {
    color: ${theme.color.text04};
  }
  .price {
    min-width: 90px;
    text-align: right;
  }
  .change {
    min-width: 60px;
    text-align: right;
    color: ${theme.color.green01};
    &.negative {
      color: ${theme.color.red01};
    }
  }
  @media (max-width: 1180px) {
    padding: 0 16px;
  }
  ${media.mobile} {
    gap: 8px;
  }
`;
