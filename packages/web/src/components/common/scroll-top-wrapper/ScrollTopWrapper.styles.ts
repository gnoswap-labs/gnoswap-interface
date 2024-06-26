import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const ScrollTopContainer = styled.div`
  position: relative;
`;



export const ScrollTopButton = styled.button<{ $hidden: boolean }>`
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  ${mixins.flexbox("row", "center", "center")}
  position: fixed;
  cursor: pointer;
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.color.background04};
  bottom: 76px;
  right: 16px;
  border-radius: 8px;
  animation: fadeIn 1s linear forwards;
  &:hover {
    background-color:  ${({ theme }) => theme.color.background04Hover};
  }
  ${({ $hidden }) => $hidden && `
    animation: fadeOut 1s linear forwards;
  `}
`;