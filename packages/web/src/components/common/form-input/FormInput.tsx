import React, { FC, memo, ReactNode } from "react";
import { FormInputStyle, FormInputWrapper } from "./FormInput.styles";

interface ParentProps {
  className?: string;
}

type Props = {
  placeholder?: string;
  name: string;
  type?: string;
  errorText?: ReactNode;
  disabled?: boolean;
  parentProps?: ParentProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBlur?: (e: any) => void;
};

const FormInput: FC<Props> = React.forwardRef<HTMLInputElement, Props>(
  (props, ref) => {
    const { errorText, parentProps } = props;
    return (
      <FormInputWrapper {...parentProps}>
        <FormInputStyle {...props} ref={ref} onBlur={props?.onBlur} />
        {errorText && <div className="error-text">{errorText}</div>}
      </FormInputWrapper>
    );
  },
);

FormInput.displayName = "FormInput";

export default memo(FormInput);
