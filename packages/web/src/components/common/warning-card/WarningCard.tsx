import {
  ContentWrapper,
  TitleWrapper,
  WarningCardWrapper,
} from "./WarningCard.styles";

export interface WarningCardProps {
  title?: React.ReactElement | string;
  icon?: React.ReactElement;
  content: React.ReactElement;
  type?: "Error" | "Warning";
  hasBorder?: boolean;
}

function WarningCard({
  title,
  icon,
  content,
  type = "Warning",
  hasBorder = true,
}: WarningCardProps) {
  return (
    <WarningCardWrapper type={type} $hasBorder={hasBorder}>
      {title && (
        <TitleWrapper>
          {icon ?? icon}
          <p>{title}</p>
        </TitleWrapper>
      )}
      <ContentWrapper>{content && content}</ContentWrapper>
    </WarningCardWrapper>
  );
}

export default WarningCard;
