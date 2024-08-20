import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { WalletResponse } from "@common/clients/wallet-client/protocols";
import IconAddPositionCircle from "@components/common/icons/IconAddPositionCircle";
import IconRemovePositionCircle from "@components/common/icons/IconRemovePositionCircle";
import IconSwapCircle from "@components/common/icons/IconSwapCircle";
import { TokenModel } from "@models/token/token-model";
import {
  RepositionLiquidityFailedResponse,
  RepositionLiquiditySuccessResponse,
} from "@repositories/position/response";
import {
  SwapRouteFailedResponse,
  SwapRouteSuccessResponse,
} from "@repositories/swap/response/swap-route-response";
import { wait } from "@utils/common";

import { RepositionBroadcastProgressWrapper } from "./RepositionBroadcastProgress.styles";
import RepositionBroadcastProgressState, {
  ProgressStateType,
} from "./RepositionBroadcastProgressState";

export interface RepositionBroadcastProgressProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  swapAtoB: boolean;
  removePosition: () => Promise<WalletResponse | null>;
  swapRemainToken: () => Promise<WalletResponse<
    SwapRouteSuccessResponse | SwapRouteFailedResponse
  > | null>;
  reposition: (
    swapToken: TokenModel | null,
    swapAmount: string | null,
  ) => Promise<WalletResponse<
    RepositionLiquiditySuccessResponse | RepositionLiquidityFailedResponse
  > | null>;
  closeModal: () => void;
  isSkipSwap: boolean;
}

const RepositionBroadcastProgress: React.FC<
  RepositionBroadcastProgressProps
> = ({
  removePosition,
  reposition,
  swapRemainToken,
  closeModal,
  tokenA,
  tokenB,
  swapAtoB,
  isSkipSwap,
}) => {
  const { t } = useTranslation();

  const [removePositionState, setRemovePositionState] =
    useState<ProgressStateType>("NONE");
  const [swapState, setSwapState] = useState<ProgressStateType>("NONE");
  const [swapResult, setSwapResult] = useState<SwapRouteSuccessResponse | null>(
    null,
  );
  const [addPositionState, setAddPositionState] =
    useState<ProgressStateType>("NONE");

  const isActive = useCallback((state: ProgressStateType) => {
    return !["NONE", "INIT"].includes(state);
  }, []);

  const makeActiveClassName = useCallback(
    (className: string, active: boolean) => {
      if (!active) {
        return className;
      }
      return `${className} active`;
    },
    [],
  );

  const processRemovePosition = (callback: () => void) => {
    if (removePositionState !== "INIT") {
      return;
    }

    setRemovePositionState("WAIT");

    removePosition().then(response => {
      if (!response) {
        setRemovePositionState("FAIL");
        return;
      }

      if (response.code === 4000) {
        setRemovePositionState("REJECTED");
        return;
      }

      if (response.code !== 0 || response.data === null) {
        setRemovePositionState("FAIL");
        return;
      }

      setRemovePositionState("BROADCAST");
      wait(async () => true, 1000).then(() => {
        setRemovePositionState("SUCCESS");
        callback();
      });
    });
  };

  const processSwap = (callback: () => void) => {
    if (swapState !== "INIT") {
      return;
    }

    setSwapResult(null);
    setSwapState("WAIT");

    swapRemainToken().then(result => {
      if (!result) {
        setSwapState("FAIL");
        return;
      }
      if (result.code === 4000) {
        setSwapState("REJECTED");
        return;
      }

      if (result.code !== 0 || result.data === null) {
        setSwapState("INSUFFICIENT_LIQUIDITY");
        return;
      }

      setSwapState("BROADCAST");

      wait(async () => true, 1000).then(() => {
        setSwapState("SUCCESS");
        setSwapResult(result.data as SwapRouteSuccessResponse);
        callback();
      });
    });
  };

  const processAddPosition = async (callback: () => void) => {
    if (addPositionState !== "INIT") {
      return;
    }

    setAddPositionState("WAIT");

    if (!isSkipSwap && !swapResult) {
      wait(async () => true, 500).then(() => {
        setAddPositionState("INIT");
      });
      return;
    }

    reposition(
      swapResult?.resultToken || null,
      swapResult?.resultAmount || null,
    ).then(response => {
      if (!response) {
        setAddPositionState("FAIL");
        return;
      }

      if (response.code === 4000) {
        setAddPositionState("REJECTED");
        return;
      }

      if (response.code !== 0 || response.data === null) {
        setAddPositionState("FAIL");
        return;
      }

      setAddPositionState("BROADCAST");
      wait(async () => true, 1000).then(() => {
        setAddPositionState("SUCCESS");
        callback();
      });
    });
  };

  useEffect(() => {
    if (removePositionState === "INIT") {
      processRemovePosition(() => {
        if (isSkipSwap) {
          setAddPositionState("INIT");
        } else {
          setSwapState("INIT");
        }
      });
    }
  }, [removePositionState, isSkipSwap]);

  useEffect(() => {
    if (swapState === "INIT") {
      processSwap(() => {
        setAddPositionState("INIT");
      });
    }
  }, [swapState]);

  useEffect(() => {
    if (addPositionState === "INIT") {
      processAddPosition(() => {});
    }
  }, [addPositionState]);

  useEffect(() => {
    setRemovePositionState("INIT");
  }, []);

  return (
    <RepositionBroadcastProgressWrapper>
      <div className="row">
        <div className="progress-info">
          <IconRemovePositionCircle active={isActive(removePositionState)} />
          <span
            className={makeActiveClassName(
              "progress-title",
              isActive(removePositionState),
            )}
          >
            {t("Reposition:repos.step.removePosi")}
          </span>
        </div>
        <RepositionBroadcastProgressState
          state={removePositionState}
          retry={() => setRemovePositionState("INIT")}
          exit={closeModal}
        />
      </div>

      <div className="divider" />

      {!isSkipSwap && (
        <React.Fragment>
          <div className="row">
            <div className="progress-info">
              <IconSwapCircle active={isActive(swapState)} />
              <span
                className={makeActiveClassName(
                  "progress-title",
                  isActive(swapState),
                )}
              >
                {t("Reposition:repos.step.swap", {
                  symbolA: swapAtoB ? tokenA.symbol : tokenB.symbol,
                  symbolB: swapAtoB ? tokenB.symbol : tokenA.symbol,
                })}
              </span>
            </div>
            <RepositionBroadcastProgressState
              state={swapState}
              retry={() => setSwapState("INIT")}
              exit={closeModal}
            />
          </div>
          <div className="divider" />
        </React.Fragment>
      )}

      <div className="row">
        <div className="progress-info">
          <IconAddPositionCircle active={isActive(addPositionState)} />
          <span
            className={makeActiveClassName(
              "progress-title",
              isActive(addPositionState),
            )}
          >
            {t("Reposition:repos.step.addPosi")}
          </span>
        </div>
        <RepositionBroadcastProgressState
          state={addPositionState}
          retry={() => setAddPositionState("INIT")}
          exit={closeModal}
        />
      </div>
    </RepositionBroadcastProgressWrapper>
  );
};

export default RepositionBroadcastProgress;
