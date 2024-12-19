import Button from "@components/common/button/Button";
import IconLink from "@components/common/icons/IconLink";
import styled from "@emotion/styled";
import { media } from "@styles/media";

export const CopyReferralLinkButton = styled(Button)`
  padding: 10px 16px 10px 16px;
  gap: 8px;
  width: 100%;
`;

export const StyledIconLink = styled(IconLink)`
  cursor: default;
  width: 16px;
  height: 16px;
  path {
    fill: ${({ theme }) => theme.color.text31};
  }
`;

export const Text = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.text31};

  ${media.mobile} {
    font-size: 12px;
  }
`;
