import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

export const DashboardInfoTitleWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  ${fonts.body4};
  color: ${({ theme }) => theme.color.text02};
  gap: 16px;
`;

export const TokenWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 16px;
`;

export const GnosLogoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 8px;
  .gnos-image-wrapper {
    ${mixins.flexbox("row", "center", "center")};
    background-color: ${({ theme }) => theme.color.point};
    width: 36px;
    height: 36px;
    border-radius: 100%;
  }
  .gnos-symbol {
    ${fonts.body6};
  }
  .gnos-image {
    width: 17px;
    height: 19.5px;
  }
`;
export const GnotLogoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 8px;
  .gnot-image-wrapper {
    ${mixins.flexbox("row", "center", "center")};
    background-color: ${({ theme }) => theme.color.icon09};
    width: 36px;
    height: 36px;
    border-radius: 100%;
  }
  .gnot-symbol {
    ${fonts.body6};
  }
  .gnot-image {
    width: 21.37499618530306px;
    height: 21.374998092651694px;
  }
`;

export const TitleDivider = styled.div`
  width: 1px;
  height: 24px;
  border: 1px solid ${({ theme }) => theme.color.border02};
`;
