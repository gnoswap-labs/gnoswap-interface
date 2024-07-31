import IconProgressBroadcast from "@components/common/icons/IconProgressBroadcast";
import IconProgressFailure from "@components/common/icons/IconProgressFailure";
import IconProgressLoader from "@components/common/icons/IconProgressLoader";
import IconProgressSuccess from "@components/common/icons/IconProgressSuccess";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { RepositionBroadcastProgressStateWrapper } from "./RepositionBroadcastProgressState.styles";

export type ProgressStateType =
  | "NONE"
  | "INIT"
  | "WAIT"
  | "BROADCAST"
  | "SUCCESS"
  | "FAIL"
  | "REJECTED"
  | "INSUFFICIENT_LIQUIDITY";

const loadingStates: ProgressStateType[] = ["WAIT"];
const broadCastStates: ProgressStateType[] = ["BROADCAST"];
const successStates: ProgressStateType[] = ["SUCCESS"];
const failStates: ProgressStateType[] = [
  "FAIL",
  "REJECTED",
  "INSUFFICIENT_LIQUIDITY",
];

export interface RepositionBroadcastProgressStateProps {
  state: ProgressStateType;
  retry: () => void;
  exit: () => void;
}

const RepositionBroadcastProgressState: React.FC<
  RepositionBroadcastProgressStateProps
> = ({ state, retry, exit }) => {
  const { t } = useTranslation();

  const description: {
    text: string;
    type?: "RETRY" | "EXIT";
  } = useMemo(() => {
    switch (state) {
      case "WAIT":
        return { text: t("Reposition:repos.status.waitingConf") };
      case "BROADCAST":
        return { text: t("Reposition:repos.status.broadcasting") };
      case "REJECTED":
        return {
          text: t("Reposition:repos.status.rejected"),
          type: "RETRY" as const,
        };
      case "FAIL":
        return {
          text: t("Reposition:repos.status.failed"),
          type: "RETRY" as const,
        };
      case "INSUFFICIENT_LIQUIDITY":
        return {
          text: t("Reposition:repos.status.insuffLiqui"),
          type: "EXIT" as const,
        };
      default:
        return { text: "" };
    }
  }, [state, t]);

  return (
    <RepositionBroadcastProgressStateWrapper>
      {description.type === "RETRY" ? (
        <span className="description">
          {description.text} -{" "}
          <a onClick={retry}>{t("Reposition:repos.action.retry")}</a>
        </span>
      ) : description.type === "EXIT" ? (
        <span className="description">
          {description.text} -{" "}
          <a onClick={exit}>{t("Reposition:repos.action.exit")}</a>
        </span>
      ) : (
        <span className="description">{description.text}</span>
      )}
      <RepositionBroadcastProgressStateIcon state={state} />
    </RepositionBroadcastProgressStateWrapper>
  );
};

export default RepositionBroadcastProgressState;

/**
 * Progress State Icon Component
 */
export interface RepositionBroadcastProgressStateIconProps {
  state: ProgressStateType;
}

const RepositionBroadcastProgressStateIcon: React.FC<
  RepositionBroadcastProgressStateIconProps
> = ({ state }) => {
  if (loadingStates.includes(state)) {
    return <IconProgressLoader className="icon-state rotate" />;
  }
  if (broadCastStates.includes(state)) {
    return <IconProgressBroadcast className="icon-state" />;
  }
  if (successStates.includes(state)) {
    return <IconProgressSuccess className="icon-state" />;
  }
  if (failStates.includes(state)) {
    return <IconProgressFailure className="icon-state" />;
  }
  return <React.Fragment />;
};
