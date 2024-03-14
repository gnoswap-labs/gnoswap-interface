import IconInfo from "@components/common/icons/IconInfo";
import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const TooltipContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  max-width: 268px;
  ${fonts.body13};
  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.background02};
`;

export const LeaderboardListHeaderWrapper = styled.div`
  ${mixins.flexbox("row", "", "space-between")};
  width: 100%;
  color: ${({ theme }) => theme.color.text04};
`;

export const Flex = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  gap: 4px;
`;

export const Gray = styled.p`
  color: ${({ theme }) => theme.color.text10};
`;

export const Info = styled(IconInfo)`
  cursor: default;
  width: 16px;
  height: 16px;
  path {
    fill: ${({ theme }) => theme.color.icon03};
  }
`;

export const SwitchWrapper = styled(Flex)`
  ${mixins.flexbox("row", "center", "center")};
  gap: 4px;
  padding-left: 16px;

  ${media.mobile} {
    padding-left: 4px;
  }
`;

export const Hover = styled.div`
  :hover {
    cursor: pointer;
  }
`;
