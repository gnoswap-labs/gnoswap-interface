import { ButtonStyleProps, ButtonWrapper, StyledText } from "./Button.styles";

interface ButtonProps {
  leftIcon?: React.ReactNode;
  text?: string;
  rightIcon?: React.ReactNode;
  className?: string;
  style: ButtonStyleProps;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export enum ButtonHierarchy {
  Primary = "Primary",
  Dark = "Dark",
}

const Button = ({
  leftIcon,
  text,
  rightIcon,
  className,
  style,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <ButtonWrapper
      {...style}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {leftIcon && leftIcon}
      {text && (
        <StyledText
          {...style}
          fontType={style.fontType}
          textColor={style.textColor}
        >
          {text}
        </StyledText>
      )}
      {rightIcon && rightIcon}
    </ButtonWrapper>
  );
};

export default Button;
