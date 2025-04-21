import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { media } from "@styles/media";

export const WalletReferralInfoWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  border-radius: 8px;
  border: ${({ theme }) => `1px solid ${theme.color.border02}`};
  & > div {
    width: 100%;
  }
`;

export const WalletReferralInfoColumn = styled.div<{ isEditing?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;

  padding: 8px 9px;
  border: 1px solid transparent;

  ${({ isEditing, theme }) =>
    isEditing &&
    css`
      background-color: ${theme.color.backgroundOpacity};
      border: 1px solid ${theme.color.border02};
      border-radius: 8px;
    `}
`;

export const InfoColumnKey = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;

  color: ${({ theme }) => theme.color.border05};
  font-size: 13px;
  font-weight: 400;
  & > div {
    font-size: 0;
  }
  svg {
    * {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }
`;

export const InfoColumnKeyTooltipContent = styled.div`
  max-width: 314px;
  font-size: 14px;
  line-height: 1.5;
`;

export const InfoColumnValue = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  color: ${({ theme }) => theme.color.text01};
  font-size: 13px;
  font-weight: 400;
  button {
    position: relative;
    font-size: 0;
  }
  .copy-icon {
    width: 16px;
    height: 16px;
    * {
      fill: ${({ theme }) => theme.color.text01};
    }
  }
`;

export const InfoReferrerDisplayText = styled.span<{ hasRegisteredReferrer?: boolean }>`
  color: ${({ theme, hasRegisteredReferrer }) => (hasRegisteredReferrer ? theme.color.text01 : theme.color.text05)};
`;

export const InfoColumnIconSet = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  svg {
    width: 16px;
    height: 16px;
  }
`;

export const ReferralBannerContentWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  & > .text {
    color: ${({ theme }) => (theme.themeKey === "dark" ? theme.color.text05 : theme.color.text03)};
    font-size: 12px;
    font-weight: 400;
    line-height: 18.2px;
    .highlight {
      font-weight: 600;
    }
    ${media.mobile} {
      font-size: 14px;
    }
  }
`;

export const ReferralInfoBanner = styled.div`
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.backgroundOpacity};
`;

export const ReferralGuideWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  & > .text {
    color: ${({ theme }) => (theme.themeKey === "dark" ? theme.color.text05 : theme.color.text03)};
    font-size: 13px;
    font-weight: 400;
  }
  * {
    fill: ${({ theme }) => (theme.themeKey === "dark" ? theme.color.text05 : theme.color.text03)};
  }
  &:hover {
    & > .text {
      color: ${({ theme }) => (theme.themeKey === "dark" ? theme.color.text03 : theme.color.text05)};
    }
    * {
      fill: ${({ theme }) => (theme.themeKey === "dark" ? theme.color.text03 : theme.color.text05)};
    }
  }
`;

export const ReferralInput = styled.input`
  color: ${({ theme }) => theme.color.text01};
  flex: 1;
  font-size: 13px;
  &::placeholder {
    color: ${({ theme }) => theme.color.border05};
  }
`;

export const IconButton = styled.button<{ isActive?: boolean; isError?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  font-size: 0;
  svg * {
    fill: ${({ theme, isActive, isError }) => {
      if (isError) return theme.color.red01;
      return isActive ? theme.color.icon07 : theme.color.icon03;
    }};
  }
  &:hover:not(:disabled) * {
    fill: ${({ theme, isError }) => {
      if (isError) return theme.color.red01;
      return theme.themeKey === "dark" ? theme.color.text05 : theme.color.background12;
    }};
  }

  &.edit-icon {
    svg * {
      fill: ${({ theme }) => theme.color.icon03};
    }
    &:hover:not(:disabled) svg * {
      fill: ${({ theme }) => (theme.themeKey === "dark" ? theme.color.text05 : theme.color.background17)};
    }
  }

  &:disabled {
    cursor: default;
  }
`;

export const ErrorText = styled.div`
  color: ${({ theme }) => theme.color.red01};
  font-size: 11px;
  font-weight: 400;
`;
