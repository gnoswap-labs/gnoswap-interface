import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

export const EarnDescriptionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  gap: 16px;
  overflow-x: auto;

  .card {
    display: flex;
    width: calc(100% / 3);
    padding: 16px 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    background: ${({ theme }) => theme.color.backgroundOpacity2};

    .title-wrapper {
      ${fonts.body11}
      color: ${({ theme }) => theme.color.text10};
    }

    .content-wrapper {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .description-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      ${fonts.p2}
      ${media.tablet} {
        ${fonts.p4}
      }
      color: ${({ theme }) => theme.color.text04};
      white-space: nowrap;
      .text {
        .highlight {
          display: none;
        }
      }
      .text::after {
        content: " ";
      }

      .highlight {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 18px;
        background: ${({ theme }) => theme.color.text32};
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .logo {
        display: inline-flex;
      }
    }

    .link-wrapper {
      color: ${({ theme }) => theme.color.text08};
      display: flex;
      flex-direction: row;
      ${fonts.p1}
      cursor: pointer;
      svg * {
        fill: ${({ theme }) => theme.color.text08};
      }
      &:hover {
        color: ${({ theme }) => theme.color.text07};
        svg * {
          fill: ${({ theme }) => theme.color.text07};
        }
      }
    }
    ${media.tablet} {
      min-width: 356px;
      .description-wrapper {
        white-space: normal;
        ${fonts.p2}

        .text {
          .highlight {
            font-weight: 500;
            display: inline-flex;
          }
        }
        > .highlight {
          display: none;
        }
      }
      .link-wrapper {
        ${fonts.p3}
      }
    }
    ${media.mobile} {
      padding: 12px 12px 12px 16px;
      min-width: 322px;
    }
  }
`;
