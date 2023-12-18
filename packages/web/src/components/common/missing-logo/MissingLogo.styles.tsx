import styled from "@emotion/styled";
import { media } from "@styles/media";

interface Props {
    width: number;
    mobileWidth?: number;
}

export const LogoWrapper = styled.div<Props>`
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    min-width: ${({ width }) => {
        return `${width}px`;
    }};
    border-radius: 50%;
    color: ${({ theme }) => theme.color.text02};
    background-color: ${({ theme }) => theme.color.text04};
    font-size: 8px;
    line-height: 10px;
    width: ${({ width }) => {
        return `${width}px`;
    }};
    height: ${({ width }) => {
        return `${width}px`;
    }};
    font-weight: 600;
    font-size: ${({ width }) => {
        return `${width === 36 ? "13" : width === 32 ? "12" : width === 28 ? "10" : width === 24 ? "9" : width === 21 ? "8" : width === 20 ? "7" : "6"}px`;
    }};
    ${media.mobile} {
        font-size: ${({ mobileWidth }) => {
        return `${mobileWidth === 36 ? "13" : mobileWidth === 32 ? "12" : mobileWidth === 28 ? "10" : mobileWidth === 24 ? "9" : mobileWidth === 21 ? "8" : mobileWidth === 20 ? "7" : "6"}px`;
        }};
        height: ${({ mobileWidth }) => {
            return `${mobileWidth}px`;
        }};
        min-width: ${({ mobileWidth }) => {
            return `${mobileWidth}px`;
        }};
        width: ${({ mobileWidth }) => {
            return `${mobileWidth}px`;
        }};
    }
`;
