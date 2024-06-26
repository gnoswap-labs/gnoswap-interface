import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const ScrollTopContainer = styled.div`
  position: relative;
`;



export const ScrollTopButton = styled.button<{ $hidden: boolean }>`
  opacity: ${({ $hidden }) => $hidden ? "0" : "1"};
  transition: all .2s;
  visibility: ${({ $hidden }) => $hidden ? "hidden" : "visible"};
  ${mixins.flexbox("row", "center", "center")}
  position: fixed;
  cursor: pointer;
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.color.background04};
  bottom: 76px;
  right: 16px;
  border-radius: 8px;
  &:hover {
    background-color:  ${({ theme }) => theme.color.background04Hover};
  }
`;