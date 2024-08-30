import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";

export const IncentiveCreationDepositWrapper = styled.div(
  ({ theme }) => css`
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    background-color: ${theme.color.backgroundOpacity};
    border-radius: 8px;
    border: 1px solid ${theme.color.border02};
    padding: 17.5px 16px;

    .section-title {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 4px;
      white-space: nowrap;
      color: ${theme.color.text04};
      ${fonts.body12}
    }

    .deposit {
      ${mixins.flexbox("row", "center", "flex-end")};
      gap: 6px;
      .amount {
        ${fonts.body4}
        color: ${theme.color.text02};
      }
    }
  `,
);

export const IncentiveCreationDepositTooltipContent = styled.div`
  ${fonts.body12}
  width: 305px;
  color: ${({ theme }) => theme.color.text11};
`;