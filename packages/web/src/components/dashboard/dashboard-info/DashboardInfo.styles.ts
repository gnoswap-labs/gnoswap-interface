import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const DashboardInfoWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  max-height: 398px;
  background-color: ${({ theme }) => theme.color.background03};
  border: 1px solid ${({ theme }) => theme.color.border01};
  border-radius: 10px;
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.08);
  padding: 24px;
  gap: 24px;
`;
