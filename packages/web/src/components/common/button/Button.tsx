import { ButtonStyleProps, ButtonWrapper, StyledText } from "./Button.styles";

interface ButtonProps {
  leftIcon?: React.ReactNode;
  text?: string;
  rightIcon?: React.ReactNode;
  style: ButtonStyleProps;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const Button = ({
  leftIcon,
  text,
  rightIcon,
  style,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <ButtonWrapper {...style} onClick={onClick} disabled={disabled}>
      {leftIcon && leftIcon}
      {text && (
        <StyledText fontType={style.fontType} textColor={style.textColor}>
          {text}
        </StyledText>
      )}
      {rightIcon && rightIcon}
    </ButtonWrapper>
  );
};

export default Button;
