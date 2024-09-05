import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const MyDelegationModalWrapper = styled.div`
  width: 100%;
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 4px;

  overflow-y: scroll;

  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.background06};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  box-shadow: ${({ theme }) => theme.color.shadow01};
  padding: 23px;

  &.large-gap {
    gap: 24px;
  }

  ${media.mobile} {
    padding: 15px;
    max-width: 500px;
    gap: 4px;
  }

  .modal-content-header {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    gap: 8px;
    margin-bottom: 12px;
    ${media.mobile} {
      margin-bottom: 4px;
    }
    .title-area {
      ${mixins.flexbox("row", "center", "center")};
      gap: 8px;
      ${fonts.h6};
      color: ${({ theme }) => theme.color.text01};

      svg {
        cursor: pointer;
        path {
          fill: ${({ theme }) => theme.color.text01};
        }
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
      }
    }
  }

  article {
    ${mixins.flexbox("column", "flex-start", "center")};
    width: 100%;
    background-color: ${({ theme }) => theme.color.background20};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    padding: 16px;
    gap: 16px;
    &:first-of-type {
      ${media.mobile} {
        position: relative;
      }
    }
    ${media.mobile} {
      padding: 11px;
      gap: 8px;
    }
    .section-title {
      ${mixins.flexbox("row", "center", "flex-start")};
      width: 100%;
      gap: 4px;
      color: ${({ theme }) => theme.color.text10};
      ${fonts.body12}

      svg {
        path {
          fill: ${({ theme }) => theme.color.text10};
        }
      }
    }

    .delegatee-select-btn {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.color.border02};
      cursor: pointer;

      .selected-delegatee {
        ${mixins.flexbox("row", "center", "flex-start")};
        color: ${({ theme }) => theme.color.text19};
        ${fonts.body13}
        gap: 5px;

        > .addr {
          ${mixins.flexbox("row", "center", "flex-start")};
          gap: 2px;
          ${fonts.p6}
          color: ${({ theme }) => theme.color.text05};

          svg {
            width: 10px;
            path {
              fill: ${({ theme }) => theme.color.text05};
            }
          }
        }
      }

      > .arrow {
        width: 16px;
        path {
          fill: ${({ theme }) => theme.color.text19};
        }
      }
    }

    .info-rows {
      flex-shrink: 0;
      width: 100%;
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      gap: 16px;
      > div {
        width: 100%;
        ${mixins.flexbox("row", "flex-start", "space-between")};
        gap: 8px;
        > div {
          ${mixins.flexbox("row", "center", "center")};
          gap: 4px;
          svg {
            width: 16px;
            height: 16px;
          }
          svg * {
            fill: ${({ theme }) => theme.color.icon03};
          }
          svg:hover * {
            fill: ${({ theme }) => theme.color.icon07};
          }
        }
        .label {
          flex-shrink: 0;
          justify-content: flex-start;
          min-width: 88px;
          color: ${({ theme }) => theme.color.text04};
          ${fonts.body12}
          ${media.mobile} {
            ${fonts.p2}
          }
        }
        .value {
          ${mixins.flexbox("row", "center", "center")};
          gap: 4px;
          text-align: end;
          color: ${({ theme }) => theme.color.text10};
          ${fonts.body12}
          ${media.mobile} {
            ${fonts.p2}
          }
        }
      }
      ${media.mobile} {
        gap: 8px;
      }
    }

    .delegatee-info-rows {
      flex-shrink: 0;
      width: 100%;
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      gap: 16px;
      > div {
        width: 100%;
        ${mixins.flexbox("row", "flex-start", "space-between")};
        gap: 8px;
        .label {
          ${mixins.flexbox("row", "center", "center")};
          gap: 4px;
          flex-shrink: 0;
          justify-content: flex-start;
          min-width: 88px;
          color: ${({ theme }) => theme.color.text03};
          ${fonts.body13}
          ${media.mobile} {
            ${fonts.p2}
          }
        }
        .value {
          ${mixins.flexbox("row", "center", "center")};
          gap: 4px;
          text-align: end;
          color: ${({ theme }) => theme.color.text05};
          ${fonts.body13}
          ${media.mobile} {
            ${fonts.p2}
          }

          span.sub {
            color: ${({ theme }) => theme.color.text04};
          }

          svg {
            width: 16px;
            height: 16px;
            path {
              fill: ${({ theme }) => theme.color.icon03};
            }
          }
          &.clickable {
            &:hover {
              cursor: pointer;
              svg {
                path {
                  fill: ${({ theme }) => theme.color.icon07};
                }
              }
            }
          }
        }
      }
      ${media.mobile} {
        gap: 8px;
      }
    }
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.color.border11};
  }

  .self-address {
    ${mixins.flexbox("row", "center", "space-between")};
    flex-wrap: wrap;

    width: 100%;
    padding: 15px;

    background-color: ${({ theme }) => theme.color.background01};
    border: 1px solid ${({ theme }) => theme.color.border02};
    border-radius: 8px;
    ${media.mobile} {
      padding: 11px;
    }

    .withdraw-address {
      width: 100%;
      .address-input {
        color: ${({ theme }) => theme.color.text01};
        width: 100%;
        font-size: 14px;

        ::placeholder {
          color: ${({ theme }) => theme.color.text04};
          opacity: 1;
        }
      }
    }
  }

  .chip-area {
    width: 100%;
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    flex-wrap: wrap;
    gap: 8px;
  }

  .button-confirm {
    flex-shrink: 0;
    gap: 8px;
    margin-top: 16px;
    height: 57px;
    span {
      ${fonts.body7}
    }
    ${media.mobile} {
      height: 41px;
      margin-top: 8px;
      span {
        ${fonts.body9}
      }
    }
  }
`;

export const ToolTipContentWrapper = styled.div`
  width: 268px;
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text02};
`;

export const MyDelWarningContentWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start")}
  margin: -4px 0;
  gap: 24px;

  .learn-more-box {
    margin-top: 4px;
    ${mixins.flexbox("row", "center")}
    font-weight: 600;
    cursor: pointer;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;