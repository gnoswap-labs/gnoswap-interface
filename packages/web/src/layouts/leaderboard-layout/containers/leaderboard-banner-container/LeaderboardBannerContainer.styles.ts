import styled from "@emotion/styled";

export const BannerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;

  width: 100%;
  height: 138px;
  padding: 40px;
  border-radius: 16px;

  background: rgb(1, 88, 168);
  background: linear-gradient(
    132deg,
    rgba(1, 88, 168, 1) 0%,
    rgba(2, 28, 146, 1) 10%,
    rgba(2, 8, 35, 1) 39%,
    rgba(2, 16, 45, 1) 54%,
    rgba(2, 32, 61, 1) 71%,
    rgba(2, 135, 199, 1) 100%,
    rgba(2, 135, 199, 1) 100%
  );
`;

export const BannerTitle = styled.div`
  color: #e0e8f4;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  & > strong {
    color: transparent;
    background: linear-gradient(269deg, #536cd7 0.82%, #a7b9f8 34.45%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const BannerDescription = styled.div`
  color: #90a2c0;
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  & > strong {
    color: transparent;
    background: linear-gradient(269deg, #536cd7 0.82%, #a7b9f8 34.45%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;
