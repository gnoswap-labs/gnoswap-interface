import React from "react";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import { wrapper } from "./AddIncentiveBanner.styles";

const DEFAULT_TEXT = "Want to boost up incentives for this pool?";
const LINK_TEXT = "Click here to start the process";

const AddIncentiveBanner: React.FC = () => {
  return (
    <div css={wrapper}>
      <p>
        {DEFAULT_TEXT}
        <span className="link-text" onClick={() => {}}>
          &nbsp;{LINK_TEXT}
          <IconStrokeArrowRight className="link-icon" />
        </span>
      </p>
    </div>
  );
};

export default AddIncentiveBanner;
