import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "space-between")};

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
  .name {
    margin: 0px 8px;
    white-space: nowrap;
  }
  .symbol {
    color: ${theme.color.text04};
  }
  .price {
    min-width: 90px;
    text-align: right;
    flex: 1;
  }
  .change {
    min-width: 60px;
    text-align: right;
    color: ${theme.color.green01};
    flex: 1;
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

export const NameSectionWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  min-width: 170px;
  flex: 1.5;
  @media (max-width: 768px) and (min-width: 400px) {
    min-width: 130px;
    max-width: 130px;
  }
`;
