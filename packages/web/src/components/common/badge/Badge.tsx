import { ValuesType } from "utility-types";
import { BadgeWrapper } from "./Badge.styles";

interface BadgeProps {
  type: BADGE_TYPE;
  leftIcon?: React.ReactNode;
  text: string;
  className?: string;
}

export const BADGE_TYPE = {
  PRIMARY: "primary",
  LINE: "line",
  LIGHT_DEFAULT: "lightDefault",
  DARK_DEFAULT: "darkDefault",
} as const;
export type BADGE_TYPE = ValuesType<typeof BADGE_TYPE>;

const Badge: React.FC<BadgeProps> = ({ type, leftIcon, text, className }) => {
  return (
    <BadgeWrapper className={className} type={type}>
      {leftIcon && <div className="badge-icon">{leftIcon}</div>}
      <span>{text}</span>
    </BadgeWrapper>
  );
};

export default Badge;
