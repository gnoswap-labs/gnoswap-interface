import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const cardStyle = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "center")};
  ${fonts.body12};
  color: ${theme.color.text02};
  width: 100%;
  gap: 4px;
  padding: 23px 0px;
  &:first-of-type {
    border-bottom: 1px solid ${theme.color.border02};
  }
  .card-title {
    ${fonts.body9};
    color: ${theme.color.text01};
    width: 100%;
    padding: 0px 23px;
    margin-bottom: 8px;
    ${media.mobile} {
      margin-bottom: 4px;
    }
  }
  > a {
    width: 100%;
  }
  .card-wrap {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    height: 36px;
    padding: 0px 23px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: ${theme.color.hover04};
    }
    ${media.mobile} {
      gap: 8px;
    }
  }
  img {
    width: 20px;
    height: 20px;
  }
  .name {
    margin: 0px 8px;
  }
  .symbol {
    color: ${theme.color.text04};
  }
  .price {
    text-align: right;
    min-width: 90px;
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
    padding: 15px 0;
    .card-title {
      padding: 0 15px;
    }
    .card-wrap {
      padding: 0 15px;
    }
  }
  ${media.mobile} {
    gap: 4px;
  }
`;

export const loadingWrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "flex-start", "center")}
  width: 100%;
  height: 118px;
  background-color: ${theme.color.background01};
  border-radius: 8px;
  padding-top: 16px;
  > span {
    color: ${theme.color.text04};
    ${fonts.body11}
    margin-top: 18px;
  }
  > div {
    width: 48px;
    height: 48px;
    &::before {
      background-color: ${theme.color.background01};
      width: 38px;
      height: 38px;
    }
  }
`;

export const NameSectionWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  min-width: 170px;
  white-space: nowrap;
`;
