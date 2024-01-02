import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";
export const WithDrawModalBackground = styled.div`
  z-index: ${Z_INDEX.modalOverlay};
`;

export const WithDrawModalWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  position: fixed;
  overflow: auto;
  max-height: 100vh;
  width: 500px;
  border-radius: 8px;
  padding: 23px;
  gap: 24px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 10px 14px 60px 0px rgba(0, 0, 0, 0.4);
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background06};
  z-index: ${Z_INDEX.modal};
  ${media.mobile} {
    width: 328px;
    padding: 16px 11px;
    transform: translate(-50%, -50%);
  }
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

    ${media.mobile} {
      padding: 0px;
    }
  }
  .btn-withdraw {
    padding: 16px 0;
    ${media.mobile} {
      padding: 10px;
    }
  }
`;

export const WithdrawTooltipContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  max-width: 300px;
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.background02};
  .dark-shadow {
    box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.2);
  }
  .light-shadow {
    box-shadow: 10px 14px 48px 0px rgba(0, 0, 0, 0.12);
  }
`;

export const WithdrawContent = styled.div`
  width: 100%;

  .title {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 4px;
    margin-bottom: 8px;
    
    label {
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      color: ${({ theme }) => theme.color.text10};
    }

    path {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }
  .label {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    color: ${({ theme }) => theme.color.text10};
    margin-bottom: 8px;
  }

  .estimate-fee {
    color: ${({ theme }) => theme.color.text04};
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
  }

  .tokens-fee {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
    color: ${({ theme }) => theme.color.text05};
  }

  .withdrawal-network {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;

    .network {
      ${mixins.flexbox("row", "center")};
      color: ${({ theme }) => theme.color.text01};
      /* ${fonts.body9}; */
      gap: 8px;

      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 130%;

      img {
        width: 24px;
        height: 24px;
      }
    }

    .approximately {
      color: ${({ theme }) => theme.color.text04};
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
    }
  }

  .withdraw {
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
  }

  .estimate-box {
    ${mixins.flexbox("row", "center", "space-between")};
    flex-wrap: wrap;

    width: 100%;
    padding: 15px;
    height: 60px;

    background-color: ${({ theme }) => theme.color.background01};
    border: 1px solid ${({ theme }) => theme.color.border02};
    border-radius: 8px;
    ${media.mobile} {
      padding: 11px;
    }
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

  .amount {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    margin-bottom: 8px;
  }

  .token {
    height: 34px;
    cursor: default;
    span {
      ${fonts.body9}
    }
    .not-selected-token {
      padding: 5px 10px 5px 12px;
      gap: 8px;
    }
    .selected-token {
      padding: 5px 10px 5px 6px;
    }
  }

  .info {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
  }

  .amount-text {
    width: 100%;
    ${fonts.body1};
    color: ${({ theme }) => theme.color.text01};
    ${media.mobile} {
      ${fonts.body5}
    }

    ::placeholder {
      color: ${({ theme }) => theme.color.text04};
      opacity: 1;
    }
  }

  .price-text,
  .balance-text {
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text04};
    ${media.mobile} {
      ${fonts.p2}
    }
  }

  .balance-text {
    cursor: pointer;
  }
`;

export const BoxFromTo = styled.div`
  width: 100%;
  ${mixins.flexbox("row", "center", "space-between")}
  .to,
  .from {
    ${mixins.flexbox("column", "flex-start", "flex-start")}
    gap: 8px;
    background-color: ${({ theme }) => theme.color.background01};
    border: 1px solid ${({ theme }) => theme.color.border02};
    width: 184px;
    padding: 15px;
    ${media.mobile} {
      padding: 11px;
    }
    border-radius: 8px;
    h5 {
      ${fonts.body12};
      color: ${({ theme }) => theme.color.text10};
    }
    > div {
      ${mixins.flexbox("row", "center", "flex-start")}
      gap: 8px;
      img {
        width: 24px;
        height: 24px;
      }
      .token-name {
        ${fonts.body9}
        color: ${({ theme }) => theme.color.text02};
        ${media.mobile} {
          ${fonts.body11}
        }
      }
    }
    p {
      ${fonts.body12};
      color: ${({ theme }) => theme.color.text04};
    }
  }
`;

export const IconButton = styled.div`
  width: 28px;
  height: 28px;
  svg {
    * {
      fill: ${({ theme }) => theme.color.icon01};
    }
  }
`;

export const BoxDescription = styled.div`
  padding: 16px;
  width: 100%;
  border-radius: 8px;
  ${mixins.flexbox("column", "flex-start")}
  gap: 16px;

  .title { 
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    ${mixins.flexbox("row", "center")}
    gap: 8px;
    height: 18px;

    svg {
      width: 16px;
      height: 14px;
    }
  }

  .fail-icon {
    * {
      fill: ${({ theme }) => theme.color.icon14};
    }
  }
  background: ${({ theme }) => theme.color.background19};
  color: ${({ theme }) => theme.color.text08};

  ul {
    padding: 0 16px;
    line-height: 130%;

    li {
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      list-style: disc outside;
      line-height: 130%;
    }
  }

  .learn-more-box {
    ${mixins.flexbox("row", "center")}
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    gap: 4px;
    cursor: pointer;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;
