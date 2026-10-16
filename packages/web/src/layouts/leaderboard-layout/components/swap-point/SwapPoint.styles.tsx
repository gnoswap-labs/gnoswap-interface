import styled from "@emotion/styled";

import { ContentWrapper, Flex, FontWeight500, Label, Wrapper } from "../point-composition/PointComposition.styles";

export { ContentWrapper, Flex, FontWeight500, Label, Wrapper };

export const Counted = styled(FontWeight500)<{ $highlighted: boolean }>`
  color: ${({ theme, $highlighted }) => ($highlighted ? theme.color.text33 : "inherit")};
  font-weight: ${({ $highlighted }) => ($highlighted ? 700 : 500)};
`;
