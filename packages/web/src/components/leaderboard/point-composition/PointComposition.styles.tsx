import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const Wrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};

  ${fonts.body12};
  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.background02};

  min-width: 168x;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Title = styled.div`
  min-width: 168px;
  width: 100%;
  height: 26px;
  display: flex;
  align-items: center;
`;

export const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 4px;
  padding-bottom: 4px;
`;

export const ContentWrapper = styled(Flex)`
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

export const Label = styled.div`
  color: ${({ theme }) => theme.color.text04};
`;

export const FontWeight500 = styled.div`
  font-weight: 500;
`;

export const FrontWeight = styled.span`
  font-size: 16px;
  font-weight: 700;

  ${media.mobile} {
    font-size: 14px;
  }
`;
