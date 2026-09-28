import "@testing-library/jest-dom";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { nullProposalDetailsInfo, ProposalDetailsInfo } from "@repositories/governance";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { DEVICE_TYPE } from "@styles/media";

import ViewProposalModal from "./ViewProposalModal";

const useGetProposalDetails = jest.fn();
const refetch = jest.fn();

jest.mock("@query/governance", () => ({
  useGetProposalDetails: (...args: unknown[]) => useGetProposalDetails(...args),
}));

const setIsModalOpen = jest.fn();

const renderModal = () =>
  render(
    <JotaiProvider>
      <GnoswapThemeProvider>
        <ViewProposalModal
          address="g1voter"
          proposalId={1}
          breakpoint={DEVICE_TYPE.WEB}
          setIsModalOpen={setIsModalOpen}
          isConnected
          isSwitchNetwork={false}
          getTooltipTextI18nKey={() => "proposal.tooltip.executed"}
          connectWallet={jest.fn()}
          switchNetwork={jest.fn()}
          voteProposal={jest.fn()}
        />
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );

const mockQueryResult = ({
  data,
  isLoading = false,
  isPreviousData = false,
  isError = false,
}: {
  data?: ProposalDetailsInfo;
  isLoading?: boolean;
  isPreviousData?: boolean;
  isError?: boolean;
}) => useGetProposalDetails.mockReturnValue({ data, isLoading, isPreviousData, isError, refetch });

describe("ViewProposalModal deep link resilience", () => {
  beforeEach(() => jest.clearAllMocks());

  it("closes itself when the proposal is confirmed missing", async () => {
    mockQueryResult({ data: nullProposalDetailsInfo });

    renderModal();

    await waitFor(() => expect(setIsModalOpen).toHaveBeenCalledWith(false));
  });

  it("stays open when the detail request fails", async () => {
    mockQueryResult({ isError: true });

    renderModal();

    await waitFor(() => expect(useGetProposalDetails).toHaveBeenCalled());
    expect(setIsModalOpen).not.toHaveBeenCalled();
  });

  it("offers a retry instead of placeholder details when the request fails", async () => {
    mockQueryResult({ isError: true });

    renderModal();

    const retry = await screen.findByText("Governance:detailModal.btn.tryAgain");
    expect(screen.queryByText(/^#0/)).not.toBeInTheDocument();

    fireEvent.click(retry);
    expect(refetch).toHaveBeenCalled();
  });

  it("does not render the previously opened proposal while another one loads", async () => {
    mockQueryResult({
      data: { proposal: { ...nullProposalDetailsInfo.proposal, id: 1, title: "Previous proposal" } },
      isPreviousData: true,
    });

    renderModal();

    await waitFor(() => expect(useGetProposalDetails).toHaveBeenCalled());
    expect(screen.queryByText(/Previous proposal/)).not.toBeInTheDocument();
    expect(setIsModalOpen).not.toHaveBeenCalled();
  });

  it("keeps the loaded proposal on screen when a background refetch fails", async () => {
    mockQueryResult({
      data: { proposal: { ...nullProposalDetailsInfo.proposal, id: 1, title: "Loaded proposal", status: "ACTIVE" } },
      isError: true,
    });

    renderModal();

    expect(await screen.findByText(/Loaded proposal/)).toBeInTheDocument();
    expect(screen.queryByText("Governance:detailModal.btn.tryAgain")).not.toBeInTheDocument();
    expect(setIsModalOpen).not.toHaveBeenCalled();
  });

  it("shows the error state when the request for the selected proposal fails", async () => {
    mockQueryResult({
      data: { proposal: { ...nullProposalDetailsInfo.proposal, id: 1, title: "Previous proposal" } },
      isPreviousData: true,
      isError: true,
    });

    renderModal();

    expect(await screen.findByText("Governance:detailModal.btn.tryAgain")).toBeInTheDocument();
    expect(screen.queryByText(/Previous proposal/)).not.toBeInTheDocument();
  });

  it("stays open while the detail request is in flight", async () => {
    mockQueryResult({ isLoading: true });

    renderModal();

    await waitFor(() => expect(useGetProposalDetails).toHaveBeenCalled());
    expect(setIsModalOpen).not.toHaveBeenCalled();
  });

  it("stays open for an existing proposal", async () => {
    mockQueryResult({
      data: { proposal: { ...nullProposalDetailsInfo.proposal, id: 1, title: "Proposal", status: "ACTIVE" } },
    });

    renderModal();

    await waitFor(() => expect(useGetProposalDetails).toHaveBeenCalled());
    expect(setIsModalOpen).not.toHaveBeenCalled();
  });
});
