import React, { FC, memo } from "react";
import { FormTextAreaStyle, FormTextAreaWrapper } from "./FormTextArea.styles";

type Props = {
  errorText?: any;
  placeholder: string;
  name: string;
  rows: number;
};

const TextArea: FC<Props> = React.forwardRef<HTMLTextAreaElement, Props>(
  (props, ref) => {
    const { errorText } = props;

    return (
      <FormTextAreaWrapper>
        <FormTextAreaStyle {...props} ref={ref} />
        {errorText && <div className="error-text">{errorText}</div>}
      </FormTextAreaWrapper>
    );
  },
);

TextArea.displayName = "TextArea";

export default memo(TextArea);
