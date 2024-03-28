import React from "react";
import {
  LayoutWrapper,
  ListContainer,
  ListSection,
  Section,
  Title,
  TitleWrapper,
} from "./LeaderboardLayout.styles";

const LeaderboardLayout = ({
  header,
  subheader,
  list,
  footer,
}: {
  header: React.ReactNode;
  subheader: React.ReactNode;
  list: React.ReactNode;
  footer: React.ReactNode;
}) => {
  return (
    <LayoutWrapper>
      {header}
      <Section>
        <TitleWrapper>
          <Title>Leaderboard</Title>
          {subheader}
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
