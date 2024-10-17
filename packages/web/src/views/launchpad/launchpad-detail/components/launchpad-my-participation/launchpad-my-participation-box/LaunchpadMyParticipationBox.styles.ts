import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const MyParticipationBoxWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  gap: 16px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  background: ${({ theme }) =>
    theme.themeKey === "dark" ? theme.color.backgroundOpacity : ""};
  padding: 16px;
  .my-participation-box-header {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 8px;
    width: 100%;
    .participation-box-index {
      color: ${({ theme }) => theme.color.text02};
      font-size: 22px;
      font-weight: 500;
    }
    .participation-box-chip {
      color: ${({ theme }) => theme.color.text06};
      padding: 4px 6px;
      font-size: 12px;
      font-weight: 400;
      border-radius: 4px;
      border: 1px solid ${({ theme }) => theme.color.border03};
      background: ${({ theme }) => theme.color.background03};
    }
  }
`;
