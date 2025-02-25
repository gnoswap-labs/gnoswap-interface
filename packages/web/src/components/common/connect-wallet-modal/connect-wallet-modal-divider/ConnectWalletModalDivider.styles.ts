import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";

export const DividerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  text-align: center;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: calc(50% - 16px);
    height: 1px;
    background-color: ${({ theme }) => theme.color.border02};
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }

  span {
    ${fonts.body12}color: ${({ theme }) => theme.color.text01};
    font-size: 12px;
    font-weight: 500;
  }
`;
