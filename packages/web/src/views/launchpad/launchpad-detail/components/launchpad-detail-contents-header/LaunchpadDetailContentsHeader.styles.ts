import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const ContentsHeaderWrapper = styled.div`
  width: 100%;
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 8px;
  .symbol-icon {
    width: 36px;
    height: 36px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .project-name {
    color: ${({ theme }) => theme.color.text02};
    font-size: 24px;
    font-weight: 600;
  }
  .project-status {
    ${mixins.flexbox("row", "center", "center")}
    gap: 4px;
    color: ${({ theme }) => theme.color.text05};
    font-size: 12px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 36px;
    background: ${({ theme }) => theme.color.backgroundOpacity7};
  }
`;
