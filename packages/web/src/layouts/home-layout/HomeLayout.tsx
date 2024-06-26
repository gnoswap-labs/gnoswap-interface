import React from "react";
import {
  BrandContainer,
  CardContainer,
  HeroSection,
  HomeLayoutWrapper,
  TokensSection,
  TokensContainer,
  BannerContainer,
} from "./HomeLayout.styles";
import { getCanScrollUpId } from "@constants/common.constant";

interface HomeLayoutProps {
  header: React.ReactNode;
  brand: React.ReactNode;
  swap: React.ReactNode;
  trending: React.ReactNode;
  highest: React.ReactNode;
  recently: React.ReactNode;
  tokenList: React.ReactNode;
  footer: React.ReactNode;
  banner: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({
  header,
  brand,
  swap,
  trending,
  highest,
  recently,
  tokenList,
  footer,
  banner,
}) => {
  return <HomeLayoutWrapper>
    {header}
    <HeroSection>
      <BrandContainer>
        {brand}
        {swap}
      </BrandContainer>
      <CardContainer>
        {trending}
        {highest}
        {recently}
      </CardContainer>
    </HeroSection>
    <TokensSection id={getCanScrollUpId("token-list")}>
      <TokensContainer>{tokenList}</TokensContainer>
    </TokensSection>
    <BannerContainer>{banner}</BannerContainer>
    {footer}
  </HomeLayoutWrapper>;
};

export default HomeLayout;
