import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const SwitchWrapper = styled.div`
  ${mixins.flexbox("row", "center", "center", false)};
  gap: 16px;
`;

export const SwitchLabel = styled.label`
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text04};
  pointer-events: none;
`;

export const SwitchInput = styled.input`
  &[type="checkbox"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-tap-highlight-color: transparent;
  }
  cursor: pointer;
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 100px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background01};
  transition: all 0.2s ease;
  &:after {
    ${mixins.posTopCenterLeft("3px")};
    content: "";
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background: ${({ theme }) => theme.color.background12};
    box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
  }
  &:checked {
    border-color: ${({ theme }) => theme.color.border06};
    background-color: ${({ theme }) => theme.color.point};
    &:after {
      background: ${({ theme }) => theme.color.text09};
      left: 22px;
    }
  }
`;
