import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
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
`;

export const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

export const ContentWrapper = styled(Flex)`
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

export const Label = styled.div`
  color: ${({ theme }) => theme.color.text04};
`;
