import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import styled from "@emotion/styled";

export const IncentivizePoolHistoryBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  width: 100%;

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 8px 0;
    .label,
    .value {
      display: flex;
      align-items: center;
      justify-content: center;
      ${fonts.body12}
    }
    .label {
      gap: 4px;
      color: ${({ theme }) => theme.color.text04};
      * {
        fill: ${({ theme }) => theme.color.text04};
      }
    }
    .value {
      gap: 8px;
      color: ${({ theme }) => theme.color.text02};
    }
  }

  .button-wrapper {
    width: 100%;
    button {
      padding: 10px;
      height: 36px;
      span {
        font-size: 13px;
        font-weight: 500;
        color: #e0e8f4;
      }
    }
  }

  .chip {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => (theme.themeKey === "dark" ? "#C3D2EA" : theme.color.text04)};
    background: ${({ theme }) => (theme.themeKey === "dark" ? theme.color.background03 : theme.color.background11)};
    border-radius: 4px;
    border: 1px solid ${({ theme }) => (theme.themeKey === "dark" ? theme.color.border03 : theme.color.border01)};
    padding: 0 6px;
    font-size: 12px;
    font-weight: 400;
  }
`;

export const historyTooltipContent = (theme: Theme) => css`
  display: block;
  width: auto;
  max-width: 320px;
  font-size: 14px;
  line-height: 1.5;
  white-space: normal;
  word-break: keep-all;
  overflow-wrap: anywhere;

  a {
    display: inline-flex;
    vertical-align: middle;
    margin-left: 2px;
  }

  a:hover {
    * {
      fill: ${theme.color.text10};
    }
  }
`;
