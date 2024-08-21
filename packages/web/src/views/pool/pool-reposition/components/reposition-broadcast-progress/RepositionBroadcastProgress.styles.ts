import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const RepositionBroadcastProgressWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  height: auto;
  gap: 8px;

  .divider {
    display: flex;
    width: 1px;
    height: 9px;
    margin: 0 10px;
    align-self: flex-start;
    background-color: ${({ theme }) => theme.color.text01};
  }

  .row {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
  }

  .progress-info {
    ${mixins.flexbox("row", "center", "flex-start")};
    width: fit-content;
    flex-shrink: 0;
    gap: 10px;

    .progress-title {
      color: ${({ theme }) => theme.color.text04};
      ${fonts.body13};

      &.active {
        color: ${({ theme }) => theme.color.text03};
      }
    }
  }
`;
