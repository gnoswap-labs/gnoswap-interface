import React, { FC, memo } from "react";
import { FormInputStyle, FormInputWrapper } from "./FormInput.styles";

interface ParentProps {
  className?: string;
}

type Props = {
  placeholder: string;
  name: string;
  errorText?: any;
  children?: React.ReactNode;
  parentProps?: ParentProps;
};

const FormInput: FC<Props> = React.forwardRef<HTMLInputElement, Props>(
  (props, ref) => {
    const { errorText, children, parentProps } = props;
    return (
      <FormInputWrapper {...parentProps}>
        <FormInputStyle {...props} ref={ref} />
        {errorText && <div className="error-text">{errorText}</div>}
        {children}
      </FormInputWrapper>
    );
  },
);

FormInput.displayName = "FormInput";

export default memo(FormInput);
