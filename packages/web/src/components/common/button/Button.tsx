import { ButtonStyleProps, ButtonWrapper, StyledText } from "./Button.styles";

interface ButtonProps {
  leftIcon?: React.ReactNode;
  text?: string | React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  style: ButtonStyleProps;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

export enum ButtonHierarchy {
  Primary = "Primary",
  Gray = "Gray",
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
  buttonRef,
}: ButtonProps) => {
  return (
    <ButtonWrapper
      ref={buttonRef}
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
          arrowColor={style.arrowColor}
        >
          {text}
        </StyledText>
      )}
      {rightIcon && rightIcon}
    </ButtonWrapper>
  );
};

export default Button;
