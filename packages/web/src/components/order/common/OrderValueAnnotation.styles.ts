import styled from "@emotion/styled";

/**
 * A note after a row value, such as `(+10%)`. It is one unit: when the row is too narrow for both,
 * it moves below the value instead of splitting mid-word.
 */
export const ValueAnnotation = styled.span`
  display: inline-block;
  max-width: 100%;
  color: ${({ theme }) => theme.color.text04};
`;
