import IconStrokeArrowRight from "../icons/IconStrokeArrowRight";
import { type Steps } from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import { cx } from "@emotion/css";
import React, { useCallback } from "react";
import { wrapper } from "./Breadcrumbs.styles";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import IconOpenLink from "../icons/IconOpenLink";
import { useTheme } from "@emotion/react";

interface BreadcrumbsProps {
  steps: Steps[];
  onClickPath: (path: string) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ steps, onClickPath }) => {
  const theme = useTheme();

  const tokenPathDisplay = useCallback((token?: TokenModel) => {
    if (!token) return "";

    const path_ = token.path;

    if (isNativeToken(token)) return "Native coin";

    const tokenPathArr = path_?.split("/") ?? [];

    if (tokenPathArr?.length <= 0) return path_;

    const lastPath = tokenPathArr[tokenPathArr?.length - 1];

    if (lastPath.length >= 12) {
      return "..." + tokenPathArr[tokenPathArr?.length - 1].slice(length - 12, length - 1);
    }

    return path_.replace("gno.land", "...");
  }, []);

  const onClickTokenPath = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>, path: string) => {
    e.stopPropagation();
    if (path === "gnot") {
      window.open("https://gnoscan.io/", "_blank");
    } else {
      window.open("https://gnoscan.io/tokens/" + encodeURIComponent(path), "_blank");
    }
  }, []);

  const renderTitle = (step: Steps) => {
    if (step.options?.type === "TOKEN_SYMBOL") {
      return <div className="token-symbol-path">
        <div className="token-title">{step.title}</div>
        <div className="token-path" onClick={(e) => onClickTokenPath(e, step.options?.token?.path ?? "")}>
          <div>{tokenPathDisplay(step.options.token)}</div>
          <IconOpenLink
            viewBox="0 0 22 22"
            fill={theme.color.text04}
            className="path-link-icon" />
        </div>
      </div>;
    }

    return step.title;
  };

  return (
    <div css={wrapper}>
      {steps.map((step, idx) => {

        return <React.Fragment key={idx}>
          <span
            className={cx({ "last-step": step === steps.at(-1) })}
            onClick={() => step.path && onClickPath(step.path)}
          >
            {renderTitle(step)}
          </span>
          {step !== steps.at(-1) && (
            <IconStrokeArrowRight className="step-icon" />
          )}
        </React.Fragment>;
      })}
    </div>
  );
};

export default Breadcrumbs;
