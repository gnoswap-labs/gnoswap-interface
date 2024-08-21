import IconInfo from "@components/common/icons/IconInfo";
import styled from "@emotion/styled";

export const StyledIconInfo = styled(IconInfo)`
  cursor: default;
  width: 16px;
  height: 16px;
  path {
    fill: ${({ theme }) => theme.color.icon03};
  }
`;
