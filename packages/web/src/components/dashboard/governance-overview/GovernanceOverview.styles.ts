import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const GovernanceOverviewWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  color: ${({ theme }) => theme.color.text02};
  padding: 24px;
  gap: 24px;
  ${media.mobile} {
    max-width: 328px;
    padding: 12px 12px 16px 12px;
    gap: 16px;
  }
`;

export const GovernanceOverviewTitleWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  color: ${({ theme }) => theme.color.text02};
  ${fonts.body9};
  gap: 4px;
  ${media.mobile} {
    ${fonts.body7};
  }
`;

export const LabelIconButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  width: 16px;
  height: 16px;
  margin: 2.5px 0px;
  svg * {
    fill: ${({ theme }) => theme.color.icon03};
  }
  :hover {
    svg * {
      fill: ${({ theme }) => theme.color.icon07};
    }
  }
`;

export const IconButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  width: 16px;
  height: 16px;
  margin: 4.5px 0px;
  svg * {
    fill: ${({ theme }) => theme.color.icon03};
  }
  :hover {
    svg * {
      fill: ${({ theme }) => theme.color.icon07};
    }
  }
`;

export const GovernanceWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")}
  width: 100%;
  ${fonts.body7};
  gap: 16px;
  ${media.mobile} {
    ${fonts.body9};
  }

  .label-title {
    ${mixins.flexbox("row", "center", "flex-start")};
    ${fonts.body10};
    color: ${({ theme }) => theme.color.text04};
    gap: 4px;
    ${media.mobile} {
      ${fonts.body12}
    }
    svg {
      cursor: pointer;
      margin: 1.5px 0px;
      width: 18px;
      height: 18px;
    }
    path {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }

  .total-issued {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    ${media.mobile} {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
  }
  .holders {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    ${media.mobile} {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
  }
  .passed-proposals {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    ${media.mobile} {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
  }
  .active-proposals {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    ${media.mobile} {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
  }
  .community-pool {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    ${media.mobile} {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
  }
  .icon-wrapper {
    ${mixins.flexbox("row", "center", "center")};
  }
  .action-icon {
    width: 16px;
    height: 16px;
  }

  .active-proposals-emissions-tooltip {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 4px;
  }
`;
