import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

export const IncentivizePoolHistoryWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 16px;
  /* width: 430px; */
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background: ${({ theme }) => theme.color.background01};
  ${media.mobile} {
    gap: 12px;
    align-self: stretch;
  }

  .box-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;

    .title {
      color: ${({ theme }) => theme.color.text02};
      ${fonts.body7};
    }
  }

  .history-box-section {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }
`;
