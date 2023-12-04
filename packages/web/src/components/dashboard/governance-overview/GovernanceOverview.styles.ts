import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const GovernanceOverviewWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  color: ${({ theme }) => theme.color.text02};
  padding: 23px;
  gap: 24px;
  ${media.mobile} {
    padding: 11px 11px 15px 11px;
    gap: 16px;
  }
`;

export const GovernanceOverviewTitleWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  color: ${({ theme }) => theme.color.text02};
  ${fonts.body9};
  gap: 6px;

  ${media.mobile} {
    gap: 4px;
    ${fonts.body7};
  }
`;

export const LabelIconButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  width: 20px;
  height: 20px;
  margin: 0px;
  svg {
    width: 20px;
    height: 20px;
  }
  ${media.mobile} {
    width: 16px;
    height: 16px;
    svg {
      width: 16px;
      height: 16px;
    }
  }
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
    ${media.tabletMiddle} {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }
  .holders {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    ${media.tabletMiddle} {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }
  .passed-proposals {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    ${media.tabletMiddle} {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }
  .active-proposals {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    ${media.tabletMiddle} {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }
  .community-pool {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    ${media.tabletMiddle} {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }
  .icon-wrapper {
    ${mixins.flexbox("row", "center", "center")};
  }
  .action-icon {
    width: 20px;
    height: 20px;

    ${media.mobile} {
      width: 16px;
      height: 16px;
    }
  }

  .active-proposals-emissions-tooltip {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 6px;
    ${media.mobile} {
      gap: 4px;
    }
  }
`;

export const LoadingTextWrapper = styled.div`
  padding: 2.5px 0;
  span {
    height: 20px;
    display: block;
  }
  ${media.mobile} {
    padding: 1px 0;
  }
`;