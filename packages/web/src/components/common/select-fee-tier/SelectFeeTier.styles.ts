import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const SelectFeeTierWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  height: 103px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 4px;
  grid-template-columns: repeat(4, 1fr);

  .fee-tier-box {
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

  &.selected,
  &:hover {
    background-color: ${({ theme }) => theme.color.background06};
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
  }
  .selected-fee-rate {
    ${mixins.flexbox("row", "center", "center")};
    ${fonts.p6};
    color: ${({ theme }) => theme.color.text03};
    background-color: ${({ theme }) => theme.color.background02};
    border-radius: 25px;
    height: 20px;
    padding: 0px 8px;
  }
`;
