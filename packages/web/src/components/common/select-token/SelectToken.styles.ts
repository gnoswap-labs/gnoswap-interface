import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const SelectTokenWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 460px;
  padding: 23px 0px 7px 0px;
  gap: 8px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.background06};
  ${media.mobile} {
    width: 328px;
    padding: 15px 0px;
  }

  .content {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    padding: 0px 23px;
    gap: 24px;
    margin-bottom: 16px;
    ${media.mobile} {
      padding: 0px 11px;
      gap: 16px;
    }
    .header {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      span {
        color: ${({ theme }) => theme.color.text02};
        ${fonts.body7}
        font-weight: 600;
        ${media.mobile} {
          ${fonts.body9}
        }
      }

      .close-wrap {
        ${mixins.flexbox("row", "center", "center")};
        cursor: pointer;
        width: 24px;
        height: 24px;
        .close-icon {
          width: 24px;
          height: 24px;
          * {
            fill: ${({ theme }) => theme.color.icon01};
          }
          &:hover {
            * {
              fill: ${({ theme }) => theme.color.icon07};
            }
          }
        }
      }
    }
    .search-wrap {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      padding: 12px 16px;
      border-radius: 8px;
      ${fonts.body9}
      ${media.mobile} {
        padding: 8px 12px;
        ${fonts.body11}
      }

      &:focus-within {
        background-color: ${({ theme }) => theme.color.background13};
        border: 1px solid ${({ theme }) => theme.color.border03};
        color: ${({ theme }) => theme.color.text01};
        .search-icon * {
          fill: ${({ theme }) => theme.color.icon05};
        }
      }

      &:not(:focus-within, .empty-status) {
        border: 1px solid ${({ theme }) => theme.color.border02};
        color: ${({ theme }) => theme.color.text01};
        .search-icon * {
          fill: ${({ theme }) => theme.color.icon08};
        }
      }

      &:not(:focus-within).empty-status {
        color: ${({ theme }) => theme.color.text17};
        border: 1px solid ${({ theme }) => theme.color.border02};
        .search-icon * {
          fill: ${({ theme }) => theme.color.icon08};
        }
      }
    }

    .search-input {
      width: 100%;
      height: 100%;
      margin-right: 16px;
      &::placeholder {
        color: ${({ theme }) => theme.color.text17};
      }
    }

    .token-select {
      ${mixins.flexbox("row", "flex-start", "flex-start")};
      gap: 8px;
      width: 100%;
      flex-wrap: wrap;
      ${media.mobile} {
        gap: 4px;
      }
      .token-button {
        ${mixins.flexbox("row", "center", "flex-start")};
        padding: 5px 12px 5px 6px;
        gap: 8px;
        border-radius: 36px;
        border: 1px solid ${({ theme }) => theme.color.border12};
        background-color: ${({ theme }) => theme.color.background02};
        height: 34px;
        &:hover {
          background-color: ${({ theme }) => theme.color.hover02};
        }
        cursor: pointer;
        span {
          color: ${({ theme }) => theme.color.text01};
          ${fonts.body9}
          ${media.mobile} {
            ${fonts.body11}
          }
        }
        .token-logo {
          width: 24px;
          height: 24px;
        }
        &.border-button-none {
          border-color: transparent;
        }
      }
    }
  }

  .token-list-wrapper {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 4px;
    max-height: 306px;
    &.token-list-wrapper-auto-height {
      height: auto;
    }
    ${media.mobile} {
      height: 248px;
    }
    overflow-y: auto;
    .no-data-found {
      ${mixins.flexbox("row", "center", "center")};
      color: ${({ theme }) => theme.color.text04};
      ${fonts.body12};
      width: 100%;
      height: 120px;
    }
    .list {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      padding: 10px 23px;
      gap: 8px;
      ${media.mobile} {
        padding: 10px 11px;
      }
      &:hover {
        background-color: ${({ theme }) => theme.color.hover02};
      }
      cursor: pointer;
      .token-logo {
        width: 24px;
        height: 24px;
      }
      .token-info {
        ${mixins.flexbox("row", "flex-start", "flex-start")};
        .token-logo {
          width: 32px;
          height: 32px;
        }
        .fake-logo {
          ${mixins.flexbox("row", "center", "center")};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          color: ${({ theme }) => theme.color.text02};
          background-color: ${({ theme }) => theme.color.border02};
          ${fonts.p6}
          ${media.mobile} {
            font-size: 8px;
            line-height: 10px;
          }
        }
        gap: 8px;
        .token-name {
          color: ${({ theme }) => theme.color.text02};
          ${fonts.body9}
          ${media.mobile} {
            ${fonts.body11}
          }
        }
        .token-symbol {
          color: ${({ theme }) => theme.color.text04};
          ${fonts.p4}
          ${media.mobile} {
            ${fonts.p4}
          }
        }
      }
      .token-info-detail {
        ${mixins.flexbox("column", "flex-start", "flex-start")};
        max-width: 250px;
        gap: 2px;
        > span {
          color: ${({ theme }) => theme.color.text04};
          ${fonts.p4}
        }
        > div {
          ${mixins.flexbox("row", "center", "flex-start")};
          gap: 8px;
          .token-name {
            max-width: 148px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .token-path {
            > div {
              max-width: 74px;
              overflow: hidden;
              text-overflow: ellipsis;
              direction: rtl;
              unicode-bidi: bidi-override;
              white-space: nowrap;
            }
            padding: 1.5px 4px;
            ${mixins.flexbox("row", "center", "flex-start")};
            gap: 2px;
            background-color: ${({ theme }) => theme.color.backgroundOpacity};
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
        ${media.mobile} {
          max-width: 175px;
          > div {
            max-width: 100%;
            .token-name {
              max-width: 79px;
            }
          }
        }
      }
      .token-balance {
        color: ${({ theme }) => theme.color.text02};
        ${fonts.body9}
        ${media.mobile} {
          ${fonts.body11}
        }
      }
    }
  }
`;

export const Divider = styled.div`
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.color.border02};
`;