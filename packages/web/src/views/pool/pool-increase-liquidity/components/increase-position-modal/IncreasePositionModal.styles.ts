import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const IncreasePositionModalWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 460px;
  padding: 23px;
  gap: 16px;
  .modal-body {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 16px;
    .header {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      > h6 {
        ${fonts.h6}
        color: ${({ theme }) => theme.color.text02};
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
      ${media.mobile} {
        > h6 {
          ${fonts.body9}
        }
      }
    }

    .content {
      width: 100%;
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      gap: 16px;
      > div {
        width: 100%;
        
        .button-confirm {
          gap: 8px;
          height: 57px;
          span {
            ${fonts.body7}
          }
          svg {
            width: 24px;
            height: 24px;
          }
        }
      }
      .label-increase {
        margin-bottom: 8px;
        color: ${({ theme }) => theme.color.text10};
        ${fonts.body12}
      }
    }

    .footer {
        ${mixins.flexbox("row", "flex-start", "flex-start")};
        color: ${({ theme }) => theme.color.text04};
        ${fonts.body12};
        a {
          color: ${({ theme }) => theme.color.background04};
          display: contents;
          ${fonts.body12};
          font-weight: 600;
          &:hover {
            color: ${({ theme }) => theme.color.background04Hover};
          }
        }
    }
  }
  ${media.mobile} {
    padding: 15px;
    width: 328px;
    .modal-body {
      gap: 12px;
        .content {
            gap: 12px;
            > div {
              .button-confirm {
                height: 41px;
                span {
                  ${fonts.body9}
                }
              }
            }
          }
    }
  }
  .fee-tier {
    width: 100%;
    background-color: ${({ theme }) => theme.color.background20};
    border: 1px solid ${({ theme }) => theme.color.border02};
    ${mixins.flexbox("row", "center", "space-between")};
    ${fonts.body12}
    color: ${({ theme }) => theme.color.text04};
    padding: 12px 16px;
    border-radius: 8px;
    margin-top: 4px;
    
  }
  .price-range {
    width: 100%;
    ${mixins.flexbox("row", "center", "space-between")};
    .label {
      color: ${({ theme }) => theme.color.text05};
      ${fonts.body12}
    }
  }
  .price-range1 {
    width: 100%;
    background-color: ${({ theme }) => theme.color.background20};
    border: 1px solid ${({ theme }) => theme.color.border02};
    border-radius: 8px;
    padding: 16px;
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    gap: 16px;
    .item {
      width: 100%;
      ${mixins.flexbox("row", "center", "space-between")};
      .label {
        color: ${({ theme }) => theme.color.text04};
        ${fonts.body12}
      }
      .value {
        color: ${({ theme }) => theme.color.text10};
        ${fonts.body12}
      }
    }
  }
  .balance-text  {
    opacity: 0;
  }
  
`;
