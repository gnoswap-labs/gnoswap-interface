import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const ViewProposalModalWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 328px;
  max-width: 700px;
  width: 90vw;
  max-height: 800px;
  height: 85dvh;
  border-radius: 8px;
  padding: 24px 0px;
  gap: 16px;
  box-shadow: 10px 14px 60px 0px rgba(0, 0, 0, 0.4);
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background06};
  ${media.mobile} {
    padding: 16px 12px 0px 12px;
  }
  .modal-body {
    flex: 1;
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    padding: 0px 24px;
    gap: 16px;
    ${media.mobile} {
      padding: 0 0 12px 0;
    }

    button {
      span {
        ${media.mobile} {
          font-size: 16px;
        }
      }
    }

    .animation {
      ${mixins.flexbox("row", "center", "center")};
      width: 100%;
      align-self: stretch;
      .animation-logo {
        width: 72px;
        height: auto;
        ${media.mobile} {
          width: 60px;
          height: 54px;
        }
      }
    }
  }
`;

export const ModalHeaderWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 8px;
  width: 100%;
  ${media.mobile} {
    gap: 16px;
  }
  .header {
    ${mixins.flexbox("row", "center", "space-between")};
    gap: 8px;
    width: 100%;
    .title {
      color: ${({ theme }) => theme.color.text02};
      ${mixins.flexbox("row", "center", "space-between")};
      gap: 12px;
      ${fonts.h6}
      ${media.mobile} {
        ${fonts.body9}
      }
    }
    .badge-label {
      flex-shrink: 0;
      color: ${({ theme }) => theme.color.text12};
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

  .mobile-badges {
    width: 100%;
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 4px;
  }

  .active-wrapper {
    gap: 12px;
    ${mixins.flexbox("row", "center", "center")};
    ${media.mobile} {
      margin-top: 4px;
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      gap: 8px;
    }
  }
`;

export const ProposalContentWrapper = styled.div`
  flex: 1;
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color.border02};
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px;
  gap: 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.themeKey === "dark" && "rgba(10, 14, 23, 0.7)"};
  ${({ theme }) => mixins.useScrollStyle(theme.themeKey === "dark" ? "#1C2230" : "#C3D2EA")}

  .content {
    flex: 1;
    min-width: 0;
    width: 100%;
    overflow-wrap: anywhere;
    color: ${({ theme }) => theme.color.text04};
    ${fonts.body12}
    ${media.mobile} {
      ${fonts.p2}
    }

    .variable {
      margin-bottom: 12px;
      .variable-type {
        ${fonts.body11}
        color: ${({ theme }) => theme.color.text03};
        margin-bottom: 12px;
      }
    }

    .markdown-style {
      width: 100%;
      min-width: 0;
      white-space: normal;

      > :first-child {
        margin-top: 0;
      }
      > :last-child {
        margin-bottom: 0;
      }
      h1,
      h2,
      h3 {
        color: ${({ theme }) => theme.color.text03};
        margin: 24px 0 16px;
      }
      h1 {
        ${fonts.body5}
      }
      h2 {
        ${fonts.body7}
      }
      h3 {
        ${fonts.body9}
      }
      p,
      ul,
      ol,
      blockquote,
      pre,
      table,
      hr {
        margin: 0 0 16px;
      }
      hr {
        border-top: 1px solid ${({ theme }) => theme.color.border02};
      }
      ul,
      ol {
        padding-left: 2em;
      }
      ul > li {
        list-style: disc;
      }
      ol > li {
        list-style: decimal;
      }
      li > ul,
      li > ol {
        margin-bottom: 0;
      }
      blockquote {
        padding-left: 1em;
        border-left: 4px solid ${({ theme }) => theme.color.border02};
      }
      pre,
      code {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }
      table {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
      }
      th,
      td {
        padding: 6px 12px;
        border: 1px solid ${({ theme }) => theme.color.border02};
      }
      img {
        max-width: 100%;
        height: auto;
      }
    }
  }
  ${media.mobile} {
    padding: 12px 4px 12px 12px;
    gap: 8px;
  }
`;

export const ModalQuorum = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 8px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color.border02};
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.themeKey === "dark" && "rgba(10, 14, 23, 0.7)"};
  ${media.mobile} {
    padding: 12px;
    gap: 10px;
  }
  .quorum-header {
    width: 100%;
    ${mixins.flexbox("row", "center", "space-between")};
    ${fonts.body12};
    ${media.mobile} {
      ${fonts.p4};
    }
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      color: ${({ theme }) => theme.color.text04};
    }
    .progress-value {
      ${mixins.flexbox("row", "center", "center")};
      flex-wrap: wrap;
      gap: 4px;
      color: ${({ theme }) => theme.color.text04};
      ${fonts.body12};
      span {
        color: ${({ theme }) => theme.color.text10};
      }
      .passed {
        background: var(--Boost, linear-gradient(270deg, #536cd7 -2.39%, #233dbd 103.33%));
        color: transparent;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    ${media.mobile} {
      gap: 8px;
      .progress-value {
        ${fonts.p4};
      }
    }
  }
`;

export const VotingPowerWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  background-color: ${({ theme }) => theme.color.backgroundOpacity2};
  border: 1px solid ${({ theme }) => theme.color.border02};
  padding: 16px;
  width: 100%;
  border-radius: 8px;
  height: 55px;
  > .title-wrapper {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 4px;
    ${fonts.body12}
    color: ${({ theme }) => theme.color.text10};

    .tooltip-icon {
      flex-shrink: 0;

      * {
        fill: ${({ theme }) => theme.color.icon03};
      }
    }
  }
  > div {
    ${mixins.flexbox("row", "center", "center")};
    color: ${({ theme }) => theme.color.text01};
  }
  .power-value {
    font-size: 18px;
    font-weight: 500;
    line-height: 34px;
  }
  ${media.mobile} {
    padding: 12px;
    > div {
      gap: 8px;
    }
    .power-value {
      ${fonts.body11}
    }
  }
`;

export const VotingPowerTooltipContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: auto;
  max-width: calc(300px - 32px);
  ${fonts.body12};
  background-color: ${({ theme }) => theme.color.background02};
  color: ${({ theme }) => theme.color.text02};
`;

export const ProposalErrorWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  gap: 16px;
  text-align: center;
  color: ${({ theme }) => theme.color.text04};
  ${fonts.body12}
  ${media.mobile} {
    ${fonts.p2}
  }

  .message {
    white-space: pre-wrap;
  }
`;
