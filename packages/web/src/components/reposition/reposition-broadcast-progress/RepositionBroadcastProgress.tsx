import React, { useCallback, useEffect, useState } from "react";
import { wait } from "@utils/common";
import { RepositionBroadcastProgressWrapper } from "./RepositionBroadcastProgress.styles";
import RepositionBroadcastProgressState, {
  ProgressStateType,
} from "./RepositionBroadcastProgressState";
import IconRemovePositionCircle from "@components/common/icons/IconRemovePositionCircle";
import IconSwapCircle from "@components/common/icons/IconSwapCircle";
import IconAddPositionCircle from "@components/common/icons/IconAddPositionCircle";
import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { SwapRouteResponse } from "@repositories/swap/response/swap-route-response";
import { AddLiquidityResponse } from "@repositories/pool/response/add-liquidity-response";

export interface RepositionBroadcastProgressProps {
  removePosition: () => Promise<WalletResponse | null>;
  swapRemainToken: () => Promise<WalletResponse<SwapRouteResponse> | null>;
  addPosition: () => Promise<WalletResponse<AddLiquidityResponse> | null>;
  closeModal: () => void;
}

const RepositionBroadcastProgress: React.FC<
  RepositionBroadcastProgressProps
> = ({ removePosition, addPosition, closeModal }) => {
  const [removePositionState, setRemovePositionState] =
    useState<ProgressStateType>("NONE");
  const [swapState, setSwapState] = useState<ProgressStateType>("NONE");
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
      wait(async () => {
        setRemovePositionState("SUCCESS");
        return true;
      }, 1000).then(() => {
        callback();
      });
    });
  };

  const processSwap = (callback: () => void) => {
    if (swapState !== "INIT") {
      return;
    }

    setSwapState("WAIT");

    wait(async () => {
      setSwapState("BROADCAST");
      return true;
    }, 1000).then(() => {
      wait(async () => {
        setSwapState("SUCCESS");
        return true;
      }, 1000).then(() => {
        callback();
      });
    });

    // XXX: Not yet apply swap router
    // swapRemainToken().then(succeed => {
    //   if (succeed) {
    //     setSwapState("BROADCAST");

    //     wait(async () => {
    //       setSwapState("SUCCESS");
    //       return true;
    //     }, 1000).then(() => {
    //       callback();
    //     });
    //   } else {
    //     setSwapState("FAIL");
    //   }
    // });
  };

  const processAddPosition = (callback: () => void) => {
    if (addPositionState !== "INIT") {
      return;
    }

    setAddPositionState("WAIT");

    addPosition().then(response => {
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
      wait(async () => {
        setAddPositionState("SUCCESS");
        return true;
      }, 1000).then(() => {
        callback();
      });
    });
  };

  useEffect(() => {
    if (removePositionState === "INIT") {
      processRemovePosition(() => {
        setSwapState("INIT");
      });
    }
  }, [removePositionState]);

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
            Remove Position
          </span>
        </div>
        <RepositionBroadcastProgressState
          state={removePositionState}
          retry={() => setRemovePositionState("INIT")}
          exit={closeModal}
        />
      </div>

      <div className="divider" />

      <div className="row">
        <div className="progress-info">
          <IconSwapCircle active={isActive(swapState)} />
          <span
            className={makeActiveClassName(
              "progress-title",
              isActive(swapState),
            )}
          >
            Swap GNS for GNOT
          </span>
        </div>
        <RepositionBroadcastProgressState
          state={swapState}
          retry={() => setSwapState("INIT")}
          exit={closeModal}
        />
      </div>

      <div className="divider" />

      <div className="row">
        <div className="progress-info">
          <IconAddPositionCircle active={isActive(addPositionState)} />
          <span
            className={makeActiveClassName(
              "progress-title",
              isActive(addPositionState),
            )}
          >
            Add Position
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
