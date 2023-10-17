import styled from "@emotion/styled";
import { media } from "@styles/media";

export const Content = styled.div`
  color: ${({ theme }) => theme.color.text15};
  background-color: ${({ theme }) => theme.color.background14};
  padding: 16px;
  border-radius: 8px;
  box-sizing: border-box;
  width: max-content;
  max-width: calc(100vw - 10px);
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2);
  ${media.mobile} {
    padding: 12px;
    gap: 4px;
  }
`;
