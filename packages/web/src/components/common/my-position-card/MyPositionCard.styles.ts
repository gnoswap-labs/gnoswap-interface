import { fonts } from "@constants/font.constant";
import { STAKED_OPTION } from "@constants/option.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

interface CardProps {
  stakeType: STAKED_OPTION;
}

export const MyPositionCardWrapper = styled.div<CardProps>`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  max-width: 322px;
  width: 100%;
  ${media.tablet} {
    max-width: 350px;
  }
  ${media.mobile} {
    max-width: 290px;
  }
  gap: 16px;
  padding: 16px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.color.background03};
  border: 1px solid
    ${({ stakeType }) =>
      stakeType === STAKED_OPTION.STAKED
        ? ({ theme }) => theme.color.border01
        : ({ theme }) => theme.color.border02};
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.08);

  transition: all 0.3s ease;
  color: ${({ theme }) => theme.color.text02};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.color.background02};
    border: 1px solid ${({ theme }) => theme.color.border03};
  }
  .title-wrapper {
    ${mixins.flexbox("column", "flex-end", "space-between")};
    width: 100%;
    gap: 4px;
    ${fonts.body5}

    .box-header {
      ${mixins.flexbox("row", "center", "space-between")};
      align-self: stretch;
    }
    .badge-group {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 2px;
      .staking-icon {
        width: 16px;
        height: 16px;
        margin-right: 4px;
        & * {
          fill: ${({ theme }) => theme.color.text06};
        }
      }
    }
  }

  .list-wrapper {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 4px;
    ${media.mobile} {
      gap: 5px;
    }
    .list-header {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
    }
    .list-content {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
    }
  }

  .label-text {
    color: ${({ theme }) => theme.color.text04};
    ${fonts.body12};
    height: 18px;
  }

  .pool-price-graph {
    width: 100%;
    padding: 16px;
    background-color: ${({ theme }) => theme.color.backgroundOpacity};
    border-radius: 8px;
    margin-top: 16px;
  }
  .price-range-info {
    ${mixins.flexbox("row", "flex-start", "space-between")};
    width: 100%;
    margin-bottom: 24px;
  }
  .current-price {
    ${mixins.flexbox("column", "flex-start", "center", false)};
    gap: 4px;
    color: ${({ theme }) => theme.color.text05};
    ${fonts.p4};
  }
  .dummy-chart {
    width: 100%;
    height: 61px;
    border: 1px solid green;
  }

  .min-max-price {
    ${mixins.flexbox("column", "center", "space-between")};
    width: 100%;
    gap: 8px;
    margin-top: 16px;
  }
  .price-section {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
  }
`;
