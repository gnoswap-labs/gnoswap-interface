import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const ActiveProjectsWrapper = styled.div`
  ${mixins.flexbox("row", "flex-end", "space-between")};
  width: 100%;
  color: ${({ theme }) => theme.color.text02};
  ${fonts.h5}
  ${media.mobile} {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    ${fonts.h6}
    gap: 12px;
  }
  .header-content {
    width: auto;
    ${mixins.flexbox("row", "center", "space-between")};
    margin-right: 24px;
  }
  .launchpad-active-projects-title-wrapper {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 8px;
    .value {
      color: ${({ theme }) => theme.color.text24};
    }
  }
`;

export const ActiveProjectsHeaderTextWrapper = styled.h2`
  white-space: nowrap;
`;
