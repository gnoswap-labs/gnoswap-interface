import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";
import styled from "@emotion/styled";

export const SelectDistributionPeriodWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "center")};
  width: 100%;
  gap: 16px;

  .section-title {
    color: ${({ theme }) => theme.color.text10};
    ${fonts.body12}
  }

  .select-date-wrap {
    ${mixins.flexbox("row", "center", "space-between")};
    gap: 16px;
    width: 100%;
  }

  .start-date,
  .period {
    ${mixins.flexbox("row", "center", "space-between")};
    height: 67px;
  }

  .start-date {
    width: 100%;
  }

  .period {
    flex-shrink: 0;
    width: 150px;
  }
`;
