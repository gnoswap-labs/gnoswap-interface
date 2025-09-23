import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

export const VideoGuideModalWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  min-width: 328px;
  max-width: 850px;
  width: 90vw;
  gap: 0;

  ${media.mobile} {
    width: 95vw;
    max-width: 95vw;
  }

  .modal-body {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    background-color: ${({ theme }) => theme.color.background06};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    box-shadow: ${({ theme }) => theme.color.shadow01};
    overflow: hidden;
    width: 100%;
    gap: 0;

    .header {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      padding: 16px 24px;
      border-bottom: 1px solid ${({ theme }) => theme.color.border02};

      > h6 {
        ${fonts.h6}
        color: ${({ theme }) => theme.color.text02};
        margin: 0;
      }

      .close-wrap {
        ${mixins.flexbox("row", "center", "center")};
        cursor: pointer;
        width: 24px;
        height: 24px;
        padding: 4px;

        .close-icon {
          width: 24px;
          height: 24px;
          color: ${({ theme }) => theme.color.text04};
          transition: color 0.2s ease;

          &:hover {
            color: ${({ theme }) => theme.color.text01};
          }
        }
      }

      ${media.mobile} {
        padding: 12px 16px;

        > h6 {
          ${fonts.body9}
        }
      }
    }

    .video-content {
      width: 100%;

      iframe {
        width: 800px;
        height: 450px;
        border: none;
        display: block;

        ${media.tablet} {
          width: 700px;
          height: 394px;
        }

        ${media.mobile} {
          width: 100%;
          height: 250px;
          min-height: 200px;
        }
      }
    }
  }
`;
