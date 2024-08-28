import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { GNS_TOKEN } from "@common/values/token-constant";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconCheck from "@components/common/icons/IconCheck";
import { Overlay } from "@components/common/modal/Modal.styles";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import useLockedBody from "@hooks/common/use-lock-body";
import { ProposalItemInfo } from "@repositories/governance";
import { DEVICE_TYPE } from "@styles/media";

import StatusBadge from "../../status-badge/StatusBadge";
import TokenChip from "../../token-chip/TokenChip";
import VotingProgressBar from "../../voting-progress-bar/VotingProgressBar";

import {
  BoxQuorumWrapper,
  ModalHeaderWrapper,
  ModalQuorum,
  ProposalContentWrapper,
  ViewProposalModalBackground,
  ViewProposalModalWrapper,
  VotingPowerWrapper,
} from "./ViewProposalModal.styles";

export interface ViewProposalModalProps {
  breakpoint: DEVICE_TYPE;
  proposalDetail: ProposalItemInfo;
  setSelectedProposalId: Dispatch<SetStateAction<number>>;
  isConnected: boolean;
  isSwitchNetwork: boolean;
  handleSelectVote: () => void;
}

type OptionVote = "YES" | "NO" | "";

const BoxQuorum = ({
  breakpoint,
  proposalDetail,
  optionVote,
  setOptionVote,
}: {
  breakpoint?: DEVICE_TYPE;
  proposalDetail: ProposalItemInfo;
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
        <div>{proposalDetail.votes.yes.toLocaleString()}</div>
        {optionVote === "YES" && showBadge}
      </div>
      <div
        className={`box-quorum ${optionVote === "NO" ? "active-quorum" : ""}`}
        onClick={() => setOptionVote("NO")}
      >
        <span>No</span>
        <div>{proposalDetail.votes.no.toLocaleString()}</div>
        {optionVote === "NO" && showBadge}
      </div>
    </BoxQuorumWrapper>
  );
};

const ViewProposalModal: React.FC<ViewProposalModalProps> = ({
  breakpoint,
  proposalDetail,
  setSelectedProposalId,
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

  useEscCloseModal(() => setSelectedProposalId(0));

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
    return proposalDetail?.myVote
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
                      text={proposalDetail.type}
                    />
                  )}
                </div>
                <div
                  className="close-wrap"
                  onClick={() => setSelectedProposalId(0)}
                >
                  <IconClose className="close-icon" />
                </div>
              </div>
              {breakpoint === DEVICE_TYPE.MOBILE && (
                <Badge
                  className="badge-label"
                  type={BADGE_TYPE.DARK_DEFAULT}
                  text={proposalDetail.type}
                />
              )}
              <div className="active-wrapper">
                <StatusBadge
                  status={proposalDetail.status}
                  time={proposalDetail.time}
                />
              </div>
            </ModalHeaderWrapper>
            <ProposalContentWrapper>
              <div className="title">{proposalDetail.title}</div>
              <div className="content">{proposalDetail.description || ""}</div>
            </ProposalContentWrapper>
            <ModalQuorum>
              <div className="quorum-header">
                <span>Quorum</span>
                <div className="progress-value">
                  <span>
                    {(
                      proposalDetail.votes.yes + proposalDetail.votes.no
                    ).toLocaleString()}
                  </span>
                  /<div>{proposalDetail.votes.max.toLocaleString()}</div>
                </div>
              </div>
              <VotingProgressBar
                yes={proposalDetail.votes.yes}
                no={proposalDetail.votes.no}
                max={proposalDetail.votes.max}
                hideNumber
              />
            </ModalQuorum>
            <BoxQuorum
              breakpoint={breakpoint}
              proposalDetail={proposalDetail}
              optionVote={optionVote}
              setOptionVote={setOptionVote}
            />
            <VotingPowerWrapper>
              <span>Your Voting Weight</span>
              <div>
                <div className="power-value">
                  {(proposalDetail.votes.yes || 0).toLocaleString()}
                </div>
                <TokenChip tokenInfo={GNS_TOKEN} />
              </div>
            </VotingPowerWrapper>
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
          </div>
        </ViewProposalModalWrapper>
      </ViewProposalModalBackground>
      <Overlay onClick={() => setSelectedProposalId(0)} />
    </>
  );
};

export default ViewProposalModal;
