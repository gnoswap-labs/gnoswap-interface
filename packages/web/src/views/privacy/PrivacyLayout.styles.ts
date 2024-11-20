import styled from "@emotion/styled";

export const PrivacyLayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${({ theme }) => theme.color.background01};
  main {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 36px;
    width: 100%;
    max-width: 1084px;
    padding: 100px 40px;
    .title-section {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 20px;
      h1 {
        font-size: 48px;
        font-weight: 700;
        color: ${({ theme }) => theme.color.text02};
      }
      h2 {
        font-size: 20px;
        font-weight: 600;
        color: ${({ theme }) => theme.color.text02};
      }
    }

    .article-section {
      color: ${({ theme }) => theme.color.text02};
      font-size: 16px;
      font-weight: 400;
      a {
        text-decoration-line: underline;
      }
      h3 {
        font-size: 18px;
        font-weight: 700;
      }
      ul {
        padding-left: 15px;
        li {
          list-style: disc outside;
        }
      }
      b {
        font-weight: 700;
      }
    }
  }
`;
