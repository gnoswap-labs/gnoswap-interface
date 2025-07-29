import React from "react";
import { useTranslation } from "react-i18next";

import { LayoutWrapper, ListContainer, ListSection, Section, Title, TitleWrapper } from "./LeaderboardLayout.styles";

const LeaderboardLayout = ({
  header,
  subheader,
  banner,
  list,
  footer,
}: {
  header: React.ReactNode;
  subheader: React.ReactNode;
  banner: React.ReactNode;
  list: React.ReactNode;
  footer: React.ReactNode;
}) => {
  const { t } = useTranslation();

  return (
    <LayoutWrapper>
      {header}
      <Section>
        <TitleWrapper>
          <Title>{t("Leaderboard:header")}</Title>
          {subheader}
          {banner}
        </TitleWrapper>
      </Section>

      <ListSection>
        <ListContainer>{list}</ListContainer>
      </ListSection>

      {footer}
    </LayoutWrapper>
  );
};

export default LeaderboardLayout;
