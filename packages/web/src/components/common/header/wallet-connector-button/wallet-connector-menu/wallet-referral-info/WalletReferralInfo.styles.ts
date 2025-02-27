import styled from "@emotion/styled";

export const WalletReferralInfoWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  padding: 0px 9px;
  border-radius: 8px;
  border: ${({ theme }) => `1px solid ${theme.color.border02}`};
  & > div {
    width: 100%;
  }
`;

export const WalletReferralInfoColumn = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 8px 0;
`;

export const InfoColumnKey = styled.div`
  color: ${({ theme }) => theme.color.border05};
  font-size: 13px;
  font-weight: 400;
`;

export const InfoColumnValue = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  color: ${({ theme }) => theme.color.border07};
  font-size: 13px;
  font-weight: 400;
  button {
    position: relative;
    font-size: 0;
  }
  .copy-icon {
    width: 16px;
    height: 16px;
  }
`;

export const ReferralInfoBanner = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.backgroundOpacity};
  & > .text {
    color: ${({ theme }) => theme.color.text05};
    font-size: 12px;
    font-weight: 400;
    line-height: 18.2px;
    .highlight {
      font-weight: 600;
    }
  }
`;

export const ReferralGuideWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  & > .text {
    color: ${({ theme }) => theme.color.text05};
    font-size: 13px;
    font-weight: 400;
  }
  * {
    fill: ${({ theme }) => theme.color.text05};
  }
  &:hover {
    & > .text {
      color: ${({ theme }) => theme.color.text03};
    }
    * {
      fill: ${({ theme }) => theme.color.text03};
    }
  }
`;
