import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { Z_INDEX } from "@styles/zIndex";
import { media } from "@styles/media";

export const SearchModalBackground = styled.div`
  z-index: ${Z_INDEX.modal};
`;

export const SearchContainer = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  position: absolute;
  top: 11.5px;
  left: calc(50vw - 230px);
  width: 460px;
  ${media.tablet} {
    top: 6px;
  }
  ${media.mobile} {
    width: 328px;
    left: calc(50vw - 164px);
  }
`;

export const SearchWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  height: 48px;
  padding: 12px 15px 12px 16px;
  border-radius: 8px;
  ${fonts.body9}
  ${media.mobile} {
    padding: 8px 12px 8px 12px;
    height: 40px;
    ${fonts.body11}
  }
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background06};
  color: ${({ theme }) => theme.color.text14};
  .search-icon * {
    fill: ${({ theme }) => theme.color.icon08};
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
    color: ${({ theme }) => theme.color.text17};
  }
`;

export const ModalContainer = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  position: absolute;
  width: 460px;
  left: calc(50vw - 230px);
  top: 67.5px;
  padding: 0px 0 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background06};
  ${media.tablet} {
    top: 62px;
  }
  ${media.mobile} {
    width: 328px;
    top: 54px;
    left: calc(50vw - 164px);
  }

  ul {
    width: 100%;
    .no-data-found,
    .recent-searches,
    .popular-tokens {
      ${mixins.flexbox("row", "center", "flex-start")};
      padding: 16px 24px 8px 24px;
      ${fonts.body12}
      color: ${({ theme }) => theme.color.text04};
      ${media.mobile} {
        padding: 12px 12px 8px 12px;
        ${fonts.p4}
      }
    }
    .no-data-found {
      ${mixins.flexbox("row", "center", "center")};
      padding: 16px 24px 16px 24px;
    }
  }
  li {
    ${mixins.flexbox("row", "center", "flex-start")};
    padding: 10px 24px;
    gap: 8px;
    cursor: pointer;
    ${media.mobile} {
      padding: 10px 12px;
      ${fonts.p2}
    }
    &.selected,
    &:hover {
      background-color: ${({ theme }) => theme.color.backgroundOpacity};
    }
    .coin-info {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 8px;
      flex: 1 0 0;
    }
    .coin-info-wrapper {
      ${mixins.flexbox("row", "flex-start", "flex-start")};
      gap: 8px;
      flex: 1 0 0;
    }
    .token-logo {
      width: 32px;
      height: 32px;
      ${media.mobile} {
        width: 24px;
        height: 24px;
      }
    }
    .coin-info-detail {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      gap: 2px;
      > span {
        color: ${({ theme }) => theme.color.text04};
        ${fonts.p4}
      }
      > div {
        ${mixins.flexbox("row", "center", "flex-start")};
        gap: 8px;
        .token-path {
          padding: 1.5px 4px;
          ${mixins.flexbox("row", "center", "flex-start")};
          gap: 2px;
          background-color: ${({ theme }) => theme.color.background26};
          border-radius: 4px;
          color: ${({ theme }) => theme.color.text04};
          ${fonts.p6}
          svg {
            width: 10px;
            height: 10px;
            * {
              fill: ${({ theme }) => theme.color.icon03}; 
            }
          }
          &:hover {
            color: ${({ theme }) => theme.color.text03};
            svg {
              * {
                fill: ${({ theme }) => theme.color.icon07}; 
              }
            }
          }
        }
      }
    }
    .coin-infor-value {
      ${mixins.flexbox("column", "flex-end", "flex-end")};
      gap: 2px;
      .positive, .negative  {
        ${fonts.p4}
        ${mixins.flexbox("row", "center", "center")};
        gap: 4px;
        
      }
      .token-price-apr {
        color: ${({ theme }) => theme.color.text04};
        ${fonts.p4}
      }
      .negative {
        svg {
          * {
            fill: ${({ theme }) => theme.color.red01};
          }
        }
      }
      .positive {
        svg {
          * {
            fill: ${({ theme }) => theme.color.green01};
          }
        }
      }
    }
    .token-name {
      ${fonts.body9};
      color: ${({ theme }) => theme.color.text02};
      ${media.mobile} {
        ${fonts.body11}
      }
    }
    .token-symbol {
      ${fonts.body12};
      color: ${({ theme }) => theme.color.text04};
      ${media.mobile} {
        ${fonts.p4}
      }
    }
    .token-price {
      ${mixins.flexbox("row", "center", "flex-end")};
      ${fonts.body9};
      color: ${({ theme }) => theme.color.text02};
      ${media.mobile} {
        ${fonts.body11}
      }
      svg {
        height: 20px;
        width: auto;
      }
    }
    .negative {
      ${fonts.body12};
      color: ${({ theme }) => theme.color.red01};
      ${media.mobile} {
        ${fonts.p2}
      }
    }
    .positive {
      ${fonts.body12};
      color: ${({ theme }) => theme.color.green01};
      ${media.mobile} {
        ${fonts.p4}
      }
    }
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: ${Z_INDEX.modalOverlay};
  background: rgba(10, 14, 23, 0.7);
`;
