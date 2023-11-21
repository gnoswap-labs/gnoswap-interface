import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const SelectFeeTierWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 4px;
  grid-template-columns: repeat(4, 1fr);
  ${media.mobile} {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    grid-gap: 8px;
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
    padding: 0 15px;
  }
  .selected-fee-rate {
    ${mixins.flexbox("row", "center", "center")};
    ${fonts.p6};
    color: ${({ theme }) => theme.color.text03};
    background-color: ${({ theme }) => theme.color.background13};
    border-radius: 25px;
    height: 20px;
    padding: 0px 8px;
  }
  ${media.mobile} {
    ${mixins.flexbox("row", "flex-start", "space-between")};
    padding: 11px;
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
