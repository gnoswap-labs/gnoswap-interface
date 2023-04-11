import IconStrokeArrowRight from "../icons/IconStrokeArrowRight";
import { type Steps } from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import { cx } from "@emotion/css";
import React from "react";
import { wrapper } from "./Breadcrumbs.styles";

interface BreadcrumbsProps {
  steps: Steps[];
  onClickPath: (path: string) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ steps, onClickPath }) => {
  return (
    <div css={wrapper}>
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <span
            className={cx({ "last-step": step === steps.at(-1) })}
            onClick={() => step.path && onClickPath(step.path)}
          >
            {step.title}
          </span>
          {step !== steps.at(-1) && (
            <IconStrokeArrowRight className="step-icon" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
