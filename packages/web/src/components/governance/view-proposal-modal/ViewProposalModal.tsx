import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconCheck from "@components/common/icons/IconCheck";
import IconCircleInCancel from "@components/common/icons/IconCircleInCancel";
import IconCircleInCheck from "@components/common/icons/IconCircleInCheck";
import IconInfo from "@components/common/icons/IconInfo";
import IconOutlineClock from "@components/common/icons/IconOutlineClock";
import IconPass from "@components/common/icons/IconPass";
import FloatingTooltip from "@components/common/tooltip/FloatingTooltip";
import { ProposalDetailProps } from "@containers/proposal-list-container/ProposalListContainer";
import { DEVICE_TYPE } from "@styles/media";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BoxQuorumWrapper,
  ModalHeaderWrapper,
  ModalQuorum,
  ProgressBar,
  ProgressWrapper,
  ProposalContentWrapper,
  ViewProposalModalBackground,
  ViewProposalModalWrapper,
  VotingPowerWrapper,
} from "./ViewProposalModal.styles";

interface Props {
  breakpoint: DEVICE_TYPE;
  proposalDetail: ProposalDetailProps;
  setIsShowProposalModal: Dispatch<SetStateAction<boolean>>;
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
  proposalDetail: ProposalDetailProps;
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
        {(optionVote === "YES" || optionVote === "") && showBadge}
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
        className={`box-quorum ${
          optionVote === "ABSTAIN" ? "active-quorum" : ""
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
  proposalDetail: ProposalDetailProps;
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
  proposalDetail: ProposalDetailProps;
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
}) => {
  const [optionVote, setOptionVote] = useState<OptionVote>("");

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const closeModal = (e: MouseEvent) => {
      if (modalRef.current && modalRef.current.contains(e.target as Node)) {
        return;
      } else {
        e.stopPropagation();
        setIsShowProposalModal(true);
      }
    };
    window.addEventListener("click", closeModal, true);
    return () => {
      window.removeEventListener("click", closeModal, true);
    };
  }, [modalRef, setIsShowProposalModal]);

  const handleSelectVoting = useCallback(() => {}, [optionVote]);

  if (!proposalDetail) return null;

  return (
    <ViewProposalModalBackground>
      <ViewProposalModalWrapper ref={modalRef}>
        <div className="modal-body">
          <ModalHeaderWrapper>
            <div className="header">
              <div className="title">
                <span>{proposalDetail.title}</span>
                {breakpoint !== DEVICE_TYPE.MOBILE && (
                  <Badge
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
                type={BADGE_TYPE.DARK_DEFAULT}
                text={proposalDetail.label}
              />
            )}
            <div className="active-wrapper">
              {MAPPING_STATUS[proposalDetail.status]}
              <div className="status time">
                <IconOutlineClock /> {proposalDetail.timeEnd}
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
                abstainOfQuorumWidth={`${
                  proposalDetail.abstainOfQuorum +
                  proposalDetail.yesOfQuorum +
                  proposalDetail.noOfQuorum
                }%`}
                noOfQuorumWidth={`${
                  proposalDetail.noOfQuorum + proposalDetail.yesOfQuorum
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
              text={
                proposalDetail.typeVote
                  ? "Already Vote"
                  : optionVote === ""
                  ? "Select Voting Option"
                  : "Vote"
              }
              style={{
                fullWidth: true,
                height: 57,
                fontType: breakpoint !== DEVICE_TYPE.MOBILE ? "body7" : "body9",
                textColor: "text09",
                bgColor: "background17",
                hierarchy:
                  optionVote === "" ? undefined : ButtonHierarchy.Primary,
              }}
              onClick={handleSelectVoting}
            />
          )}
          <ProposalContent proposalDetail={proposalDetail} />
        </div>
      </ViewProposalModalWrapper>
    </ViewProposalModalBackground>
  );
};

export default ViewProposalModal;
