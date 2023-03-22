import { BadgeStyleProps, BadgeWrapper, BadgeText } from "./Badge.styles";

interface BadgeProps {
  text: string;
  style: BadgeStyleProps;
}

const Badge: React.FC<BadgeProps> = ({ text, style }) => {
  return (
    <BadgeWrapper {...style}>
      <BadgeText {...style}>{text}</BadgeText>
    </BadgeWrapper>
  );
};

export default Badge;
