import { ContentWrapper, TitleWrapper, WarningCardWrapper } from "./WarningCard.styles";

export interface WarningCardProps {
  title?: React.ReactElement | string;
  icon?: React.ReactElement;
  content: React.ReactElement;
}

function WarningCard({ title, icon, content }: WarningCardProps) {

  return (<WarningCardWrapper>
    {title && <TitleWrapper>
      {icon ?? icon}
      <p>{title}</p>
    </TitleWrapper>}
    <ContentWrapper>
      {content && content}
    </ContentWrapper>
  </WarningCardWrapper>);
}

export default WarningCard;