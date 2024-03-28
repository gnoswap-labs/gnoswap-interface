import styled from "@emotion/styled";

export const RangeWrapper = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 1px;
  background: red;
  background-color: ${({ theme }) => theme.color.point};
  outline: none;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 19px;
    height: 19px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.color.point};
    cursor: pointer;
  }
`;
