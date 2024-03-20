import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
interface Props {
  isClosed: boolean;
}
export const PositionHistoryWrapper = styled.div<Props>`
  width: calc(100% + 48px);
  margin-left: -24px;
  .title {
    ${mixins.flexbox("flex", "center", "center")}
    text-align: center;
    color: ${({ theme }) => theme.color.text04};
    ${fonts.body9}
    gap: 5px;
    margin-bottom: 16px;
    cursor: pointer;
    .icon-wrapper {
      width: 16px;
      height: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      * {
        fill: ${({ theme }) => theme.color.icon03};
      }
    }
    &:hover {
      color: ${({ theme }) => theme.color.text03};

      * {
        fill: ${({ theme }) => theme.color.icon07};
      }
    }
  }
  ${media.mobile} {
    width: calc(100% + 24px);
    margin-left: -12px;
    .title {
      margin-bottom: 4px;
      ${fonts.p2}
      margin: 4px 0 16px 0;
    }
  }
`;

export const TabletHistory = styled.div`
  width: 100%;
`;
