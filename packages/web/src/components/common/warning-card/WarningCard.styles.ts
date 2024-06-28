import styled from "@emotion/styled";
import mixins from "@styles/mixins";


export const WarningCardWrapper = styled.div<{
  type: "Error" | "Warning";
  $hasBorder: boolean;
}>`
  padding: 16px;
  width: 100%;
  border-radius: 8px;
  ${mixins.flexbox("column", "flex-start")}
  gap: 16px;
  background: ${({ theme, type }) => {
    if (type === "Error") {
      return theme.color.background31;
    }

    return theme.color.background30;
  }};
  border: ${({ theme, type, $hasBorder }) => {
    if (!$hasBorder) return;

    if (type === "Error") {
      return `1px solid ${theme.color.border21}`;
    }


    return `1px solid ${theme.color.border20}`;
  }};
  
  & > * {
    color: ${({ theme, type }) => {
    if (type === "Error") {
      return theme.color.red01;
    }
    return theme.color.text33;
  }};
  }
`;

export const TitleWrapper = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  ${mixins.flexbox("row", "center")}
  gap: 4px;
`;

export const ContentWrapper = styled.div`
  font-size: 14px;
`;