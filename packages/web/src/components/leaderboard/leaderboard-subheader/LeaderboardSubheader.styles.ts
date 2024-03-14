import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

export const Container = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  gap: 36px;

  ${media.mobile} {
    flex-direction: column;
    gap: 24px;
  }
`;

export const TitleWrapper = styled.p`
  width: 597px;

  @media screen and (max-width: 597px) {
    width: 100%;
  }

  ${fonts.body10};
`;

export const Text04 = styled.span`
  color: ${({ theme }) => theme.color.text04};
`;
