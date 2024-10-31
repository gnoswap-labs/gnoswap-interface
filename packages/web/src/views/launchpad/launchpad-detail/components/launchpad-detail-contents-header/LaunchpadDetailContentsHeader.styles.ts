import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const ContentsHeaderWrapper = styled.div`
  width: 100%;
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 8px;
  ${media.tablet} {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
  }
  .symbol-icon {
    width: 36px;
    height: 36px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .project-header {
    ${mixins.flexbox("row", "center", "center")};
    max-width: 100%;
    gap: 8px;
  }
  .project-name {
    width: 100%;
    color: ${({ theme }) => theme.color.text02};
    font-size: 24px;
    font-weight: 600;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .project-status {
    ${mixins.flexbox("row", "center", "center")}
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 36px;
    &.upcoming {
      background: rgba(0, 89, 255, 0.2);
      color: var(--Light-Palette-Blue, #007aff);
    }
    &.ongoing {
      background: rgba(22, 199, 138, 0.2);
      color: var(--Green-text, #16c78a);
    }
    &.ended {
      background: ${({ theme }) => theme.color.backgroundOpacity7};
      color: ${({ theme }) => theme.color.text05};
    }
  }
`;
