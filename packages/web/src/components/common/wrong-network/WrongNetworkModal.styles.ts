import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";
export const WrongNetworkModalBackground = styled.div`
  position: fixed;
  overflow: scroll;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  height: 100lvh;
  background: rgba(10, 14, 23, 0.7);
  z-index: ${Z_INDEX.modalOverlay};
`;

export const WrongNetworkModalWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  overflow: hidden;
  width: 460px;
  border-radius: 8px;
  padding: 23px;
  gap: 24px;
  ${mixins.positionCenter};
  box-shadow: 10px 14px 60px 0px rgba(0, 0, 0, 0.4);
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background06};
  ${media.mobile} {
    width: 328px;
    padding: 16px 11px;
    transform: translate(-50%, -50%);
  }
  .modal-body {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    height: 100%;
    gap: 24px;
    .header {
      width: 100%;
      ${mixins.flexbox("row", "center", "flex-end")};
      .close-wrap {
        width: 24px;
        height: 24px;
        cursor: pointer;
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
    .fail-icon {
        width: 100%;
        ${mixins.flexbox("row", "center", "center")};
        ${media.mobile} {
            svg {
                width: 60px;
                height: 54px;
            }
        }
      }
    .wrong-description {
        width: 100%;
        ${mixins.flexbox("column", "center", "center")};
        gap: 8px;
        h5 {
            ${fonts.body7}
            color: ${({ theme }) => theme.color.text02}; 
        }
        p {
            ${fonts.body12}
            color: ${({ theme }) => theme.color.text04}; 
        }
    
    }
    .try-again-button {
        width: 100%;
        height: 57px;
    }
  }
`;
