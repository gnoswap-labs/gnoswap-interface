import styled from "@emotion/styled";

export const SkeletonWrapper = styled.div`
  width: fit-content;
  height: fit-content;
  & > * {
    visibility: hidden;
  }
`;
