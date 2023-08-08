import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

export const TrendingCardListwrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")}
  width: 100%;
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 16px 0px;
  gap: 16px;

  h2 {
    ${mixins.flexbox("row", "center", "center")};
    ${fonts.body9};
    gap: 10px;
    color: ${({ theme }) => theme.color.text02};
    padding: 0px 24px 0px 20px;
    ${media.tablet} {
      padding: 0px 16px 0px 16px;
    }
  }

  .icon-flame {
    width: 25px;
    height: 25px;
  }
`;
