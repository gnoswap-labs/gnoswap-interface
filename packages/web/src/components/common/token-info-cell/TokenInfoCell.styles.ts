import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const TokenInfoCellWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "flex-start")};
  color: ${({ theme }) => theme.color.text01};
  gap: 2px;
  width: 100%;

  .token-logo {
    margin-top: 2px;
  }

  .token-name-symbol-path {
    ${mixins.flexbox("column", "start", "start")}
    cursor: pointer;
    margin-left: 8px;
    width: 100%;

    &.mobile {
      gap: 2px;
    }

    .token-name-path {
      ${mixins.flexbox("row", "flex-start", "start")}
      gap: 8px;
      width: 100%;

      .token-name {
        flex-shrink: 0;
        font-size: 15px;
        white-space: nowrap;
      }

      .token-link {
        &:hover {
          color: ${({ theme }) => theme.color.text03};
          .path-link-icon {
            path {
              fill: ${({ theme }) => theme.color.text03};
            }
          }
        }
        ${mixins.flexbox("row", "center", "flex-start")}
        ${fonts.p6};
        color: ${({ theme }) => theme.color.text04};
        background-color: ${({ theme }) => theme.color.background26};
        padding: 2px 4px;
        gap: 4px;
        border-radius: 4px;
        white-space: nowrap;

        .path-link-icon {
          width: 10px;
          height: 10px;
          fill: ${({ theme }) => theme.color.text04};
        }
      }
    }

    .token-symbol {
      ${fonts.p4};
      color: ${({ theme }) => theme.color.text04};
    }
  }
`;
