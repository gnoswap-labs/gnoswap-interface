import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

/**
 * The DCA Buy section. It shares the swap card's `.second-section` look but
 * has no amount row, so it keeps the designed height and centers its content.
 * The doubled class outranks the swap card's nested `.second-section` rule.
 */
export const OrderToBuySection = styled.div`
  &&.second-section {
    min-height: 67px;
    justify-content: center;
  }

  .buy-label {
    ${fonts.body9};
    color: ${({ theme }) => theme.color.text04};
  }
`;

/** Inputs below the token sections of the DCA and limit forms. */
export const OrderFieldRow = styled.div`
  ${mixins.flexbox("row", "stretch", "flex-start")};
  width: 100%;
  gap: 2px;
`;

export const OrderField = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  flex: 1;
  min-width: 0;
  padding: 15px 23px;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background: ${({ theme }) => theme.color.background20};
  &:focus-within {
    border-color: ${({ theme }) => theme.color.border15};
  }
  ${media.mobile} {
    padding: 11px;
  }

  &.centered {
    align-items: center;
  }
  &.wide {
    flex: 2;
  }

  .field-label {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 4px;
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text04};
    ${media.mobile} {
      ${fonts.p2};
    }
    .icon-info {
      width: 16px;
      height: 16px;
      * {
        fill: ${({ theme }) => theme.color.icon03};
      }
    }
  }

  .field-value {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    gap: 8px;
  }

  .field-input,
  .field-text {
    width: 100%;
    min-width: 0;
    ${fonts.body3};
    color: ${({ theme }) => theme.color.text01};
    background: transparent;
    ${media.mobile} {
      ${fonts.body7};
    }
    &::placeholder {
      color: ${({ theme }) => theme.color.text04};
    }
  }

  .field-badge {
    ${mixins.flexbox("row", "center", "center")};
    flex-shrink: 0;
    height: 28px;
    padding: 0px 12px;
    border-radius: 36px;
    ${fonts.p1};
    color: ${({ theme }) => theme.color.text02};
    background-color: ${({ theme }) => theme.color.background13};
    ${media.mobile} {
      ${fonts.p2};
    }
  }
`;

export const OrderFooter = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  gap: 8px;

  .button-order {
    height: 57px;
    span {
      ${fonts.body7};
    }
    ${media.mobile} {
      height: 41px;
      span {
        ${fonts.body9};
      }
    }
  }
  .button-actionable {
    cursor: pointer;
  }

  .min-trading {
    ${fonts.body12};
    color: ${({ theme }) => theme.color.red01};
    ${media.mobile} {
      ${fonts.p2};
    }
  }
`;

export const OrderCardSkeletonWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  gap: 2px;

  .skeleton-section {
    ${mixins.flexbox("column", "flex-start", "center")};
    width: 100%;
    height: 100px;
    padding: 15px 23px;
    gap: 12px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    background: ${({ theme }) => theme.color.background20};
    &.short {
      height: 80px;
    }
  }
`;
