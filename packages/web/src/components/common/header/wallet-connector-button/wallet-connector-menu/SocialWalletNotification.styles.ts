import styled from "@emotion/styled";

export const SocialWalletNotificationWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 12px;

  margin: 16px 0;
  padding: 12px 15.5px;
  border-radius: 8px;
  border: 1px solid rgba(249, 115, 22, 0.1);
  background: rgba(249, 115, 22, 0.08);

  color: #f97316;
  font-size: 12px;

  .social-wallet-noti-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    .title {
      font-weight: 600;
    }
  }

  .content {
    font-weight: 400;
  }

  .margin-left {
    margin-left: 2px;
  }
`;
