import styled from "@emotion/styled";

import { ContentWrapper, Flex, FontWeight500, Label, Wrapper } from "../point-composition/PointComposition.styles";

export { ContentWrapper, Flex, FontWeight500, Label, Wrapper };

export const Description = styled.div`
  max-width: 240px;
  color: ${({ theme }) => theme.color.text04};
`;
