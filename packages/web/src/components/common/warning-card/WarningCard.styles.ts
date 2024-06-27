import styled from "@emotion/styled";
import mixins from "@styles/mixins";


export const WarningCardWrapper = styled.div`
  padding: 16px;
  width: 100%;
  border-radius: 8px;
  ${mixins.flexbox("column", "flex-start")}
  gap: 16px;
  background: ${({ theme }) => theme.color.background30};
  border: 1px solid ${({ theme }) => theme.color.border20};
  
  & > * {
    color: ${({ theme }) => theme.color.text33};
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