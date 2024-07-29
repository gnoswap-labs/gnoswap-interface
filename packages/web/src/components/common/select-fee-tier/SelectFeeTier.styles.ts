import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const SelectFeeTierWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "space-between")};
  width: 100%;
  display: grid;
  grid-gap: 4px;
  justify-items: center;
  margin-bottom: 15px;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 1fr;
  ${media.mobile} {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    grid-gap: 8px;
  }
  height: 0px;
  margin-bottom: 0px;
  transition: height 0.5s ease;
  visibility: hidden;
  overflow: hidden;
  &.open {
    margin-bottom: 15px;
    min-height: 119px;
    visibility: visible;
    ${media.mobile} {
      height: 280px;
    }
  }
`;

export const SelectFeeTierItemWrapper = styled.div`
  ${mixins.flexbox("column", "center", "space-between")};
  width: 100%;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  padding: 11px 7px;
  cursor: pointer;
  transition: all 0.3s ease;
  > div {
    ${mixins.flexbox("column", "center", "space-between")};
  }
  &.selected,
  &:hover {
    background-color: ${({ theme }) => theme.color.background11};
    border: 1px solid ${({ theme }) => theme.color.border03};
  }

  .fee-rate {
    color: ${({ theme }) => theme.color.text02};
    ${fonts.body9};
  }
  .desc {
    ${fonts.p7};
    color: ${({ theme }) => theme.color.text05};
    text-align: center;
    margin: 8px 0px;
    padding: 0 8px;
  }
  .selected-fee-rate {
    width: 100%;
    white-space: nowrap;
    ${mixins.flexbox("row", "center", "center")};
    ${fonts.p6};
    color: ${({ theme }) => theme.color.text03};
    background-color: ${({ theme }) => theme.color.background13};
    border-radius: 25px;
    height: 20px;
    padding: 0px 4px;
    div {
      width: 12px;
      height: 12px;
      &::before {
        background-color: ${({ theme }) => theme.color.background05};
        width: 9px;
        height: 9px;
      }
    }
    ${media.mobile} {
      width: auto;
    }
  }
  ${media.mobile} {
    ${mixins.flexbox("row", "flex-start", "space-between")};
    padding: 11px;
    .selected-fee-rate {
      padding: 0px 12px;
    }
    > div {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      gap: 4px;
    }
    .desc {
      margin: 4px 0 0 0;
      padding: 0;
    }
  }
`;
