import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

const PC_BREAKPOINT_PADDING = 24;
const MOBILE_BREAKPOINT_PADDING = 12;

export const VideoGuideModalWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  color: ${({ theme }) => theme.color.text02};
  min-width: 328px;
  max-width: 850px;
  width: 90vw;
  gap: 0;

  ${media.mobile} {
    width: 95vw;
    max-width: 95vw;
  }

  .modal-body {
    position: relative;
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    background-color: ${({ theme }) => theme.color.background06};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    box-shadow: ${({ theme }) => theme.color.shadow01};
    /* overflow: hidden; */
    width: 100%;
    gap: 24px;
    padding: ${PC_BREAKPOINT_PADDING}px;
    ${media.mobile} {
      padding: ${MOBILE_BREAKPOINT_PADDING}px;
      gap: 12px;
    }

    .header-actions {
      ${mixins.flexbox("row", "center", "center")};
      gap: 10px;
      position: absolute;
      top: ${PC_BREAKPOINT_PADDING}px;
      right: ${PC_BREAKPOINT_PADDING}px;
      ${media.mobile} {
        top: ${MOBILE_BREAKPOINT_PADDING}px;
        right: ${MOBILE_BREAKPOINT_PADDING}px;
        gap: 4px;
      }

      .icon-wrap {
        ${mixins.flexbox("row", "center", "center")};
        width: 24px;
        height: 24px;
        padding: 4px;

        .header-action-icon {
          width: 24px;
          height: 24px;

          path {
            fill: ${({ theme }) => theme.color.icon03};
          }

          &:hover {
            path {
              fill: ${({ theme }) => theme.color.icon07};
            }
          }

          ${media.mobile} {
            width: 20px;
            height: 20px;
          }
        }
      }
    }

    .title-wrapper {
      width: 100%;
      ${mixins.flexbox("column", "center", "center")}
      gap: 8px;
      .title {
        font-size: 24px;
        font-weight: 500;
        line-height: 33.6px;
        ${media.mobile} {
          font-size: 18px;
        }
      }
      .sub-title {
        color: ${({ theme }) => theme.color.text03};
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        line-height: 18.2px;
        ${media.mobile} {
          font-size: 13px;
        }
      }
    }

    .content-wrapper {
      width: 100%;
    }

    .video-content {
      width: 100%;
      position: relative;

      iframe {
        width: 100%;
        height: auto;
        aspect-ratio: 16/9;
        border: none;
        display: block;
        min-height: 200px;

        &.loading {
          visibility: hidden;
        }
      }

      .loading-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .footer {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 24px;
      width: 100%;
      a {
        width: 100%;
      }
      .button {
        gap: 8px;
        height: 57px;
        font-size: 18px;
        ${media.mobile} {
          height: 42px;
          gap: 2px;
          svg {
            width: 16px;
            height: 16px;
          }
        }
        span {
          font-size: 16px;
          ${media.mobile} {
            font-size: 14px;
          }
        }
      }
      ${media.mobile} {
        flex-direction: column;
        gap: 12px;
      }
    }
  }
`;
