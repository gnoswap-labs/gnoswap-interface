import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";

export const NoticeContextWrapper = styled.div`
  display: block;
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  height: 100lvh;
  z-index: ${Z_INDEX.modalTooltip};
`;

export const NoticeUIWrapper = styled.div`
  position: absolute;
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.2);
  padding: 16px 24px;
  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.background02};
  border: 1px solid ${({ theme }) => theme.color.border02};
  width: 380px;
  bottom: 38px;
  right: 36px;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
  ${media.mobile} {
    width: 90%;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    height: fit-content;
    padding: 16px;
  }
  .icon-close {
    width: 24px;
    height: 24px;
    position: absolute;
    top: 16px;
    right: 24px;
    cursor: pointer;
    svg {
      width: 24px;
      height: 24px;
    }
    ${media.mobile} {
      right: 16px;
    }
  }
  .notice-body {
    width: 100%;
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    gap: 16px;
    .icon-success {
      width: 36px;
      height: 36px;
      ${media.mobile} {
        width: 24px;
        height: 24px;
      }
    }
    > div {
      ${mixins.flexbox("column", "flex-start", "flex-start")};

      gap: 8px;
      h5 {
        ${fonts.body5};
        color: ${({ theme }) => theme.color.text02};
        ${media.mobile} {
          ${fonts.body7}
        }
      }
      p {
        ${fonts.body12}
        color: ${({ theme }) => theme.color.text03};
        ${media.mobile} {
          ${fonts.p2}
        }
      }
      a {
        width: 100%;
        ${mixins.flexbox("row", "center", "flex-start")};
        ${fonts.body11}
        color: ${({ theme }) => theme.color.text04};
        gap: 4px;
        ${media.mobile} {
          ${fonts.p2}
        }
        svg {
          width: 16px;
          height: 16px;
        }
      }
      ${media.mobile} {
        padding-right: 24px;
      }
    }
  }
`;
