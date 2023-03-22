import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { UpDownType } from "./CardList";

export const CardListWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "center")};
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.gray60};
  border: 1px solid ${({ theme }) => theme.colors.gray50};
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 16px 0px;
  ul {
    ${mixins.flexbox("column", "center", "flex-start")};
    width: 100%;
  }
`;

export const Title = styled.strong`
  ${({ theme }) => theme.fonts.body9};
  color: ${({ theme }) => theme.colors.gray10};
  margin-bottom: 16px;
  padding-left: 24px;
`;

export const ListItem = styled.li`
  ${mixins.flexbox("row", "center", "flex-start")};
  ${({ theme }) => theme.fonts.body12};
  width: 100%;
  height: 40px;
  padding: 0px 24px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${({ theme }) => theme.colors.colorBlack};
  }
`;

export const StyledA = styled.a<{ upDownType: UpDownType }>`
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.colors.colorWhite};
  i,
  .list-content {
    color: ${({ theme }) => theme.colors.gray40};
  }
  i {
    margin-right: 24px;
  }
  .token-name {
    margin: 0px 8px;
  }
  .list-content {
    margin-right: auto;
  }
  .arrow-up * {
    fill: ${({ theme }) => theme.colors.colorGreen};
  }
  .arrow-down * {
    fill: ${({ theme }) => theme.colors.colorRed};
  }
  .notation-value {
    color: ${({ theme, upDownType }) => {
      if (upDownType === UpDownType.UP) return theme.colors.colorGreen;
      if (upDownType === UpDownType.DOWN) return theme.colors.colorRed;
      return theme.colors.colorWhite;
    }};
  }
`;
