import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const FormTextAreaWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  gap: 6px;
  .error-text {
    color: ${({ theme }) => theme.color.red02};
    ${fonts.p4}
    ${media.mobile} {
      ${fonts.p6}
    }
  }
`;

export const FormTextAreaStyle = styled.textarea`
  width: 100%;
  border-radius: 8px;
  padding: 16px;
  background-color: ${({ theme }) => theme.color.backgroundOpacity2};
  color: ${({ theme }) => theme.color.text01};
  border: 1px solid ${({ theme }) => theme.color.border02};
  resize: none;
  &::placeholder {
    color: ${({ theme }) => theme.color.text04};
    ${fonts.body9}
    ${media.mobile} {
      ${fonts.body11}
    }
  }
`;
