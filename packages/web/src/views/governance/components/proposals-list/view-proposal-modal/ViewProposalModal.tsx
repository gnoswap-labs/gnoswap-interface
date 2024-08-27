import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconCheck from "@components/common/icons/IconCheck";
import IconCircleInCancel from "@components/common/icons/IconCircleInCancel";
import IconCircleInCheck from "@components/common/icons/IconCircleInCheck";
import IconInfo from "@components/common/icons/IconInfo";
import IconOutlineClock from "@components/common/icons/IconOutlineClock";
import IconPass from "@components/common/icons/IconPass";
import { Overlay } from "@components/common/modal/Modal.styles";
import FloatingTooltip from "@components/common/tooltip/FloatingTooltip";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import useLockedBody from "@hooks/common/use-lock-body";
import { DEVICE_TYPE } from "@styles/media";
import { ProposalDetailInfo } from "@views/governance/containers/proposal-list-container/ProposalListContainer";

import {
  BoxQuorumWrapper,
  ModalHeaderWrapper,
  ModalQuorum,
  ProgressBar,
  ProgressWrapper,
  ProposalContentWrapper,
  ViewProposalModalBackground,
  ViewProposalModalWrapper,
  VotingPowerWrapper
} from "./ViewProposalModal.styles";

dayjs.extend(relative);

interface Props {
  breakpoint: DEVICE_TYPE;
  proposalDetail: ProposalDetailInfo;
  setIsShowProposalModal: Dispatch<SetStateAction<boolean>>;
  isConnected: boolean;
  isSwitchNetwork: boolean;
  handleSelectVote: () => void;
}

type OptionVote = "YES" | "NO" | "ABSTAIN" | "";

const MAPPING_STATUS: Record<string, JSX.Element> = {
  ACTIVE: (
    <div className="status success">
      <IconCircleInCheck className="success-icon status-icon" /> Active
    </div>
  ),
  REJECTED: (
    <div className="status failed">
      <IconCircleInCancel className="failed-icon status-icon" /> Reject
    </div>
  ),
  CANCELLED: (
    <div className="status cancelled">
      <IconInfo className="cancelled-icon status-icon" /> Cancelled
    </div>
  ),
  PASSED: (
    <div className="status passed">
      <IconPass className="passed-icon status-icon" /> Passed
    </div>
  ),
};

const BoxQuorum = ({
  breakpoint,
  proposalDetail,
  optionVote,
  setOptionVote,
}: {
  breakpoint?: DEVICE_TYPE;
  proposalDetail: ProposalDetailInfo;
  optionVote: OptionVote;
  setOptionVote: Dispatch<SetStateAction<OptionVote>>;
}) => {
  const showBadge = useMemo(() => {
    return breakpoint !== DEVICE_TYPE.MOBILE ? (
      <Badge className="badge" type={BADGE_TYPE.DARK_DEFAULT} text={"Voted"} />
    ) : (
      <div className="badge">
        <IconCheck />
      </div>
    );
  }, [, breakpoint]);
  return (
    <BoxQuorumWrapper>
      <div
        className={`box-quorum ${optionVote === "YES" ? "active-quorum" : ""}`}
        onClick={() => setOptionVote("YES")}
      >
        <span>Yes</span>
        <div>{proposalDetail.currentValue.toLocaleString()}</div>
        {optionVote === "YES" && showBadge}
      </div>
      <div
        className={`box-quorum ${optionVote === "NO" ? "active-quorum" : ""}`}
        onClick={() => setOptionVote("NO")}
      >
        <span>No</span>
        <div>
          {(
            proposalDetail.currentValue +
            (proposalDetail.maxValue * proposalDetail.noOfQuorum) / 100
          ).toLocaleString()}
        </div>
        {optionVote === "NO" && showBadge}
      </div>
      <div
        className={`box-quorum ${optionVote === "ABSTAIN" ? "active-quorum" : ""
          }`}
        onClick={() => setOptionVote("ABSTAIN")}
      >
        <span>Abstain</span>
        <div>{proposalDetail.maxValue.toLocaleString()}</div>
        {optionVote === "ABSTAIN" && showBadge}
      </div>
    </BoxQuorumWrapper>
  );
};

const VotingPower = ({
  proposalDetail,
}: {
  proposalDetail: ProposalDetailInfo;
}) => {
  return (
    <VotingPowerWrapper>
      <span>Your Voting Power</span>
      <div>
        <div className="power-value">
          {proposalDetail.votingPower.toLocaleString()}
        </div>
        <div className="power-currency">
          <img src={proposalDetail.icon} alt="token logo" />
          <span>{proposalDetail.currency}</span>
        </div>
      </div>
    </VotingPowerWrapper>
  );
};

const ProposalContent = ({
  proposalDetail,
}: {
  proposalDetail: ProposalDetailInfo;
}) => {
  return (
    <ProposalContentWrapper>
      <div className="title">{proposalDetail.title}</div>
      <div className="content">{proposalDetail.description}</div>
    </ProposalContentWrapper>
  );
};

const ViewProposalModal: React.FC<Props> = ({
  breakpoint,
  proposalDetail,
  setIsShowProposalModal,
  isSwitchNetwork,
  isConnected,
  handleSelectVote,
}) => {
  const [optionVote, setOptionVote] = useState<OptionVote>("");

  const modalRef = useRef<HTMLDivElement | null>(null);
  useLockedBody(true);

  const handleResize = () => {
    if (typeof window !== "undefined" && modalRef.current) {
      const height = modalRef.current.getBoundingClientRect().height;
      if (height >= window?.innerHeight) {
        modalRef.current.style.top = "0";
        modalRef.current.style.transform = "translateX(-50%)";
      } else {
        modalRef.current.style.top = "50%";
        modalRef.current.style.transform = "translate(-50%, -50%)";
      }
    }
  };

  useEscCloseModal(() => setIsShowProposalModal(false));

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [modalRef]);

  const handleSelectVoting = useCallback(() => {
    handleSelectVote();
  }, [optionVote, handleSelectVote]);

  const disableButton = useMemo(() => {
    if (!isConnected) {
      return false;
    }
    if (isSwitchNetwork) {
      return false;
    }
    return optionVote === "";
  }, [isConnected, isSwitchNetwork, optionVote]);

  const textButton = useMemo(() => {
    if (!isConnected) {
      return "Wallet Login";
    }
    if (isSwitchNetwork) {
      return "Switch to Gnoland";
    }
    return proposalDetail.typeVote
      ? "Already Vote"
      : optionVote === ""
        ? "Select Voting Option"
        : "Vote";
  }, [isConnected, isSwitchNetwork, proposalDetail, optionVote]);

  if (!proposalDetail) return null;

  return (
    <>
      <ViewProposalModalBackground>
        <ViewProposalModalWrapper ref={modalRef}>
          <div className="modal-body">
            <ModalHeaderWrapper>
              <div className="header">
                <div className="title">
                  <span>{proposalDetail.title}</span>
                  {breakpoint !== DEVICE_TYPE.MOBILE && (
                    <Badge
                      className="badge-label"
                      type={BADGE_TYPE.DARK_DEFAULT}
                      text={proposalDetail.label}
                    />
                  )}
                </div>
                <div
                  className="close-wrap"
                  onClick={() => setIsShowProposalModal(false)}
                >
                  <IconClose className="close-icon" />
                </div>
              </div>
              {breakpoint === DEVICE_TYPE.MOBILE && (
                <Badge
                  className="badge-label"
                  type={BADGE_TYPE.DARK_DEFAULT}
                  text={proposalDetail.label}
                />
              )}
              <div className="active-wrapper">
                {MAPPING_STATUS[proposalDetail.status]}
                <div className="status time">
                  <IconOutlineClock className="status-icon" />{" "}
                  {`Voting ${proposalDetail.status === "ACTIVE" ? "Ends in" : "Ended1"
                    } ${dayjs(proposalDetail.timeEnd).fromNow()} `}
                  <br />
                  {proposalDetail.timeEnd}
                </div>
              </div>
            </ModalHeaderWrapper>
            <ModalQuorum>
              <div className="quorum-header">
                <span>Quorum</span>
                <div className="progress-value">
                  <span>{proposalDetail.currentValue.toLocaleString()}</span>/
                  <div>{proposalDetail.maxValue.toLocaleString()}</div>
                </div>
              </div>
              <ProgressWrapper>
                <ProgressBar
                  rateWidth={`${proposalDetail.yesOfQuorum}%`}
                  abstainOfQuorumWidth={`${proposalDetail.abstainOfQuorum +
                    proposalDetail.yesOfQuorum +
                    proposalDetail.noOfQuorum
                    }%`}
                  noOfQuorumWidth={`${proposalDetail.noOfQuorum + proposalDetail.yesOfQuorum
                    }%`}
                >
                  <FloatingTooltip
                    className="float-progress"
                    position="top"
                    content={`Yes ${proposalDetail.yesOfQuorum}%`}
                  >
                    <div className="progress-bar-yes-of-quorum progress-bar-rate" />
                  </FloatingTooltip>
                  <FloatingTooltip
                    className="float-progress"
                    position="top"
                    content={`No ${proposalDetail.noOfQuorum}%`}
                  >
                    <div className="progress-bar-no-of-quorum progress-bar-rate" />
                  </FloatingTooltip>
                  <FloatingTooltip
                    className="float-progress"
                    position="top"
                    content={`Abstain ${proposalDetail.abstainOfQuorum}%`}
                  >
                    <div className="progress-bar-abstain progress-bar-rate" />
                  </FloatingTooltip>
                </ProgressBar>
              </ProgressWrapper>
            </ModalQuorum>
            <BoxQuorum
              breakpoint={breakpoint}
              proposalDetail={proposalDetail}
              optionVote={optionVote}
              setOptionVote={setOptionVote}
            />
            <VotingPower proposalDetail={proposalDetail} />
            {proposalDetail.status === "ACTIVE" && (
              <Button
                disabled={disableButton}
                text={textButton}
                style={{
                  fullWidth: true,
                  height: breakpoint !== DEVICE_TYPE.MOBILE ? 57 : 41,
                  fontType:
                    breakpoint !== DEVICE_TYPE.MOBILE ? "body7" : "body9",
                  textColor: "text09",
                  bgColor: "background17",
                  width:
                    breakpoint !== DEVICE_TYPE.MOBILE ? undefined : "304px",
                  hierarchy: disableButton
                    ? undefined
                    : ButtonHierarchy.Primary,
                }}
                onClick={handleSelectVoting}
              />
            )}
            <ProposalContent proposalDetail={proposalDetail} />
          </div>
        </ViewProposalModalWrapper>
      </ViewProposalModalBackground>
      <Overlay onClick={() => setIsShowProposalModal(false)} />
    </>
  );
};

export default ViewProposalModal;
