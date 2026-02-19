import React, { useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { GNOT_TOKEN, GNS_TOKEN, XGNS_TOKEN } from "@common/values/token-constant";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconClose from "@components/common/icons/IconCancel";
import withLocalModal from "@components/hoc/with-local-modal";
import { useWindowSize } from "@hooks/common/use-window-size";
import { nullProposalDetailsInfo, nullUserVotingInfo, PROPOSAL_TYPE } from "@repositories/governance";
import { DEVICE_TYPE } from "@styles/media";
import { useGetProposalDetails } from "@query/governance";
import { rawToDisplayAmount } from "@utils/number-utils";

import StatusBadge from "../../status-badge/StatusBadge";
import TokenChip from "../../token-chip/TokenChip";
import TypeBadge from "../../type-badge/TypeBadge";
import VotingProgressBar from "../../voting-progress-bar/VotingProgressBar";
import VoteButtons from "./VoteButtons";
import VoteCtaButton from "./VoteCtaButton";
import IconPassed from "@components/common/icons/IconPassed";
import { ProposalTooltipContent } from "../../voting-progress-bar/VotingProgressBar.styles";

import {
  ModalHeaderWrapper,
  ModalQuorum,
  ProposalContentWrapper,
  ViewProposalModalWrapper,
  VotingPowerWrapper,
} from "./ViewProposalModal.styles";
import Tooltip from "@components/common/tooltip/Tooltip";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { safeParseTime } from "@utils/time.utils";

export interface ViewProposalModalProps {
  address: string;
  proposalId: number;
  myVotingWeight: number;
  breakpoint: DEVICE_TYPE;
  setIsModalOpen: (isOpen: boolean) => void;
  isConnected: boolean;
  isSwitchNetwork: boolean;
  getTooltipTextI18nKey: (status: string, isMajorityVoted: boolean, yesVotes: number, noVotes: number) => string;
  connectWallet: () => void;
  switchNetwork: () => void;
  voteProposal: (proposalId: number, voteYes: boolean) => void;
}

const ViewProposalModal: React.FC<ViewProposalModalProps> = ({
  address,
  proposalId,
  myVotingWeight,
  breakpoint,
  setIsModalOpen,
  isSwitchNetwork,
  isConnected,
  getTooltipTextI18nKey,
  connectWallet,
  switchNetwork,
  voteProposal,
}) => {
  const Modal = useMemo(
    () =>
      withLocalModal(ViewProposalModalWrapper, (isOpen: boolean) => {
        if (!isOpen) setIsModalOpen(false);
      }),
    [setIsModalOpen],
  );

  const { data, isLoading } = useGetProposalDetails({ proposalId, address });

  const proposalDetail = useMemo(() => {
    if (!data?.proposal) return nullProposalDetailsInfo.proposal;
    return data.proposal;
  }, [data]);

  const proposalDetailContent = useMemo(() => {
    return proposalDetail.content;
  }, [proposalDetail]);

  const { numericVotingInfo, userVotingInfo } = useMemo(() => {
    const {
      votingInfo: { maxVotingWeight, yesVotingWeight, noVotingWeight, quorumAmount },
      userVotingInfo = nullUserVotingInfo,
    } = proposalDetail;

    return {
      numericVotingInfo: {
        maxVotingWeight: Number(maxVotingWeight) || 0,
        yesVotingWeight: Number(yesVotingWeight) || 0,
        noVotingWeight: Number(noVotingWeight) || 0,
        quorumAmount: Number(quorumAmount) || 0,
      },
      userVotingInfo,
    };
  }, [proposalDetail]);

  const { t } = useTranslation();
  const { isMobile } = useWindowSize();
  const [selectedVote, setSelectedVote] = useState(userVotingInfo?.voteType || "");

  const hasVoted = useMemo(() => {
    const { yesVotingWeight, noVotingWeight } = numericVotingInfo;
    return Boolean(yesVotingWeight) || Boolean(noVotingWeight);
  }, [numericVotingInfo]);

  const isMajorityVoted = useMemo(() => {
    const { yesVotingWeight, noVotingWeight, maxVotingWeight } = numericVotingInfo;

    if (maxVotingWeight === 0) return false;

    return yesVotingWeight + noVotingWeight >= maxVotingWeight / 2;
  }, [numericVotingInfo]);

  const { yesVotes, noVotes } = useMemo(() => {
    if (proposalDetail.status === "CANCELLED") {
      return { yesVotes: 0, noVotes: 0 };
    }
    return {
      yesVotes: numericVotingInfo.yesVotingWeight,
      noVotes: numericVotingInfo.noVotingWeight,
    };
  }, [proposalDetail.status, numericVotingInfo]);

  const tooltipTextI18nKey = React.useMemo(() => {
    return getTooltipTextI18nKey(proposalDetail.status, isMajorityVoted, yesVotes, noVotes);
  }, [proposalDetail.status, getTooltipTextI18nKey, isMajorityVoted, yesVotes, noVotes]);

  if (!proposalDetail) return null;

  const hasVoteButton = ["UPCOMING", "ACTIVE"].includes(proposalDetail.status);

  if (isLoading) {
    return <LoadingModal onClose={() => setIsModalOpen(false)} />;
  }

  return (
    <Modal>
      <div className="modal-body">
        <ModalHeaderWrapper>
          <div className="header">
            <div className="title">
              <span>{`#${proposalDetail.id} ${proposalDetail.title}`}</span>
              {breakpoint !== DEVICE_TYPE.MOBILE && (
                <>
                  <TypeBadge type={proposalDetail.proposalType} />
                  {proposalDetail.status === "EXPIRED" && (
                    <Badge
                      className="proposal-badge"
                      type={BADGE_TYPE.DARK_DEFAULT}
                      text={t("Governance:proposal.status.expired")}
                    />
                  )}
                  {proposalDetail.status === "EXECUTED" && (
                    <Badge
                      className="proposal-badge"
                      type={BADGE_TYPE.DARK_DEFAULT}
                      text={t("Governance:proposal.status.executed")}
                    />
                  )}
                </>
              )}
            </div>
            <div className="close-wrap" onClick={() => setIsModalOpen(false)}>
              <IconClose className="close-icon" />
            </div>
          </div>
          {breakpoint === DEVICE_TYPE.MOBILE && (
            <div className="mobile-badges">
              <TypeBadge type={proposalDetail.proposalType} />
              {proposalDetail.status === "EXPIRED" && (
                <Badge
                  className="proposal-badge"
                  type={BADGE_TYPE.DARK_DEFAULT}
                  text={t("Governance:proposal.status.expired")}
                />
              )}
              {proposalDetail.status === "EXECUTED" && (
                <Badge
                  className="proposal-badge"
                  type={BADGE_TYPE.DARK_DEFAULT}
                  text={t("Governance:proposal.status.executed")}
                />
              )}
            </div>
          )}
          <div className="active-wrapper">
            <StatusBadge
              breakpoint={breakpoint}
              status={proposalDetail.status}
              time={safeParseTime(proposalDetail.statusTime)}
              twoline={false}
            />
          </div>
        </ModalHeaderWrapper>
        <ProposalContentWrapper
          style={{
            maxHeight: hasVoteButton ? (isMobile ? "368px" : "329px") : isMobile ? "499px" : "486px",
          }}
        >
          <div className="content">
            {proposalDetail.proposalType === PROPOSAL_TYPE.PROPOSAL_COMMUNITY_POOL_SPEND && (
              <>
                <div className="variable">
                  <div className="variable-type">{t("Governance:detailModal.content.recipient")}</div>
                  {proposalDetailContent.recipient}
                </div>
                <div className="variable">
                  <div className="variable-type">{t("Governance:detailModal.content.amount")}</div>
                  {rawToDisplayAmount(proposalDetailContent.amount, GNOT_TOKEN.decimals)} {GNS_TOKEN.symbol}
                </div>
              </>
            )}
            {proposalDetail.proposalType === PROPOSAL_TYPE.PROPOSAL_PARAMETER_CHANGE && (
              <div className="variable">
                <div className="variable-type">{t("Governance:detailModal.content.change")}</div>
                {proposalDetailContent.parameters.map(item => (
                  <>
                    {`Pkg Path: ${item.pkgPath}, Func: ${item.func}, Params: ${item.param}`}
                    <br />
                  </>
                ))}
              </div>
            )}
            <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-style">
              {`${proposalDetailContent.description.replaceAll("\\n", "\n")}`}
            </ReactMarkdown>
          </div>
        </ProposalContentWrapper>
        <ModalQuorum>
          <div className="quorum-header">
            <span>{t("Governance:detailModal.quorum")}</span>
            <div className="progress-value">
              <Tooltip
                placement="top"
                forcedClose={!hasVoted}
                FloatingContent={
                  <ProposalTooltipContent>
                    <Trans ns="Governance" components={{ br: <br /> }} i18nKey={tooltipTextI18nKey} />
                  </ProposalTooltipContent>
                }
              >
                <span className={isMajorityVoted ? "passed" : ""}>
                  {isMajorityVoted && <IconPassed />}
                  {rawToDisplayAmount(yesVotes + noVotes, XGNS_TOKEN.decimals).toLocaleString()}
                </span>
              </Tooltip>
              /<div>{rawToDisplayAmount(numericVotingInfo.maxVotingWeight, XGNS_TOKEN.decimals).toLocaleString()}</div>
            </div>
          </div>
          <VotingProgressBar
            yes={numericVotingInfo.yesVotingWeight}
            no={numericVotingInfo.noVotingWeight}
            max={numericVotingInfo.maxVotingWeight}
            isMajorityVoted={isMajorityVoted}
            hideNumber
          />
        </ModalQuorum>
        <VoteButtons
          breakpoint={breakpoint}
          votedType={userVotingInfo.voteType || ""}
          isVoted={userVotingInfo.isVoted}
          isClickable={proposalDetail.status === "ACTIVE"}
          yesCount={rawToDisplayAmount(numericVotingInfo.yesVotingWeight, XGNS_TOKEN.decimals)}
          noCount={rawToDisplayAmount(numericVotingInfo.noVotingWeight, XGNS_TOKEN.decimals)}
          selectedVote={selectedVote}
          setSelectedVote={setSelectedVote}
        />
        {hasVoteButton && (
          <>
            <VotingPowerWrapper>
              <span>{t("Governance:detailModal.votingWeight")}</span>
              <div>
                <div className="power-value">
                  {myVotingWeight.toLocaleString()}
                </div>
                <TokenChip tokenInfo={XGNS_TOKEN} />
              </div>
            </VotingPowerWrapper>
            <VoteCtaButton
              breakpoint={breakpoint}
              isWalletConnected={isConnected}
              isSwitchNetwork={isSwitchNetwork}
              voteType={userVotingInfo.voteType}
              voteWeigth={userVotingInfo.votingWeight}
              myVotingWeight={myVotingWeight}
              status={proposalDetail.status}
              selectedVote={selectedVote}
              handleVote={() => {
                voteProposal(proposalDetail.id, selectedVote === "YES");
                setIsModalOpen(false);
              }}
              connectWallet={connectWallet}
              switchNetwork={switchNetwork}
            />
          </>
        )}
      </div>
    </Modal>
  );
};

export default ViewProposalModal;

interface LoadingModalProps {
  onClose: () => void;
}

const LoadingModal = ({ onClose }: LoadingModalProps) => {
  const Modal = useMemo(
    () =>
      withLocalModal(ViewProposalModalWrapper, (isOpen: boolean) => {
        if (!isOpen) onClose();
      }),
    [onClose],
  );

  return (
    <Modal>
      <div className="modal-body">
        <ModalHeaderWrapper>
          <div className="header">
            <div />
            <div className="close-wrap" onClick={onClose}>
              <IconClose className="close-icon" />
            </div>
          </div>
        </ModalHeaderWrapper>
        <ProposalContentWrapper
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxHeight: "100%",
          }}
        >
          <div className="animation">
            <LoadingSpinner />
          </div>
        </ProposalContentWrapper>
      </div>
    </Modal>
  );
};
