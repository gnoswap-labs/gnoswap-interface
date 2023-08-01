import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { Z_INDEX } from "@styles/zIndex";

export const SearchModalBackground = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
  background: rgba(10, 14, 23, 0.7);
  z-index: ${Z_INDEX.modalOverlay};
`;

export const SearchContainer = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  position: absolute;
  top: 11.5px;
  left: calc(50vw - 230px);
  width: 460px;
`;

export const SearchWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  height: 48px;
  padding: 12px 15px 12px 16px;
  border-radius: 8px;
  ${fonts.body9}
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background06};
  color: ${({ theme }) => theme.color.text14};
  .search-icon * {
    fill: ${({ theme }) => theme.color.icon03};
  }
  box-shadow: 10px 14px 48px 0px rgba(0, 0, 0, 0.12);
  &:focus-within {
    border: 1px solid ${({ theme }) => theme.color.border03};
    background-color: ${({ theme }) => theme.color.background02};
    color: ${({ theme }) => theme.color.text01};
    .search-icon * {
      fill: ${({ theme }) => theme.color.icon05};
    }
  }
`;

export const InputStyle = styled.input`
  width: 100%;
  height: 100%;
  margin-right: 16px;
  &::placeholder {
    color: ${({ theme }) => theme.color.text04};
  }
`;

export const ModalContainer = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  position: absolute;
  width: 460px;
  left: calc(50vw - 230px);
  top: 67.5px;
  padding: 8px 0px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background06};

  ul {
    width: 100%;
    .recent-searches,
    .popular-tokens {
      ${mixins.flexbox("row", "center", "flex-start")};
      padding: 16px 24px 8px 24px;
      ${fonts.body12}
      color: ${({ theme }) => theme.color.text04};
    }
  }
  li {
    ${mixins.flexbox("row", "center", "flex-start")};
    padding: 16px 24px;
    gap: 8px;
    cursor: pointer;
    &.selected,
    &:hover {
      background-color: ${({ theme }) => theme.color.backgroundOpacity};
    }
    .coin-info {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 8px;
      flex: 1 0 0;
    }
    .token-logo {
      width: 24px;
      height: 24px;
    }
    .token-name {
      ${fonts.body8};
      color: ${({ theme }) => theme.color.text02};
    }
    .token-symbol {
      ${fonts.body8};
      color: ${({ theme }) => theme.color.text04};
    }
    .token-price {
      ${fonts.body7};
      color: ${({ theme }) => theme.color.text02};
    }
    .negative {
      ${fonts.body12};
      color: ${({ theme }) => theme.color.red01};
    }
    .positive {
      ${fonts.body12};
      color: ${({ theme }) => theme.color.green01};
    }
  }
`;
