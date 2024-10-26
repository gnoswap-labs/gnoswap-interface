import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const ParticipationNoDataWrapper = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  gap: 28px;
  padding: 16px;
  width: 100%;
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
  .banner-text {
    ${mixins.flexbox("column", "center", "center")};
    gap: 4px;
  }
  .banner-text-description {
    color: ${({ theme }) => theme.color.text31};
    font-weight: 400;
    span {
      background: var(
        --Gradient,
        linear-gradient(268deg, #536cd7 -9.74%, #a7b9f8 110.99%)
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 18px;
      font-weight: 600;
    }
  }
`;
