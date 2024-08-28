import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const ProposalDetailWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  background-color: ${({ theme }) => theme.color.background03};
  border: 1px solid ${({ theme }) => theme.color.border01};
  cursor: pointer;
  border-radius: 8px;
  padding: 24px 36px;
  gap: 8px;
  width: 100%;
  &:hover {
    background-color: ${({ theme }) => theme.color.hover01};
    border: 1px solid ${({ theme }) => theme.color.border14};
    box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.08);
  }
  .header {
    ${mixins.flexbox("row", "center", "space-between")};
    flex-wrap: nowrap;
    width: 100%;
    gap: 20px;

    .left-section {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 8px;

      .title {
        ${fonts.body5};
        color: ${({ theme }) => theme.color.text02};
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }

      .proposal-badge {
        flex-shrink: 0;
      }
    }

    .proponent {
      ${fonts.p4};
      white-space: nowrap;
    }
  }
  ${media.mobile} {
    padding: 12px;
    gap: 12px;
    .header {
      .title {
        ${fonts.body11};
      }
    }
  }

  .active-wrapper {
    gap: 12px;
    ${mixins.flexbox("row", "center", "center")};
    ${media.mobile} {
      gap: 8px;
      ${mixins.flexbox("column", "flex-start", "flex-start")};
    }
  }
`;
