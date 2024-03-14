import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

export const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
  gap: 36px;

  ${media.mobile} {
    flex-direction: column;
    gap: 24px;
  }
`;

export const SubheaderTitle = styled.p`
  width: 597px;
  ${fonts.body10};
  color: ${({ theme }) => theme.color.text04};

  @media screen and (max-width: 597px) {
    width: 100%;
  }
`;
