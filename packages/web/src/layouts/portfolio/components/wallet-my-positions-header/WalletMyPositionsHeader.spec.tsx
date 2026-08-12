import { render, screen } from "@testing-library/react";

import { usePositionData } from "@hooks/pool/data/use-position-data";

import WalletMyPositionsHeader from "./WalletMyPositionsHeader";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ isSwitchNetwork: false }),
}));

jest.mock("@hooks/pool/data/use-position-data", () => ({
  usePositionData: jest.fn(),
}));

jest.mock("@components/common/switch/Switch", () => ({
  __esModule: true,
  default: () => <input type="checkbox" readOnly />,
}));

jest.mock("./WalletMyPositionsHeader.styles", () => ({
  wrapper: {},
}));

const mockUsePositionData = usePositionData as jest.Mock;

describe("WalletMyPositionsHeader", () => {
  beforeEach(() => {
    mockUsePositionData.mockImplementation(({ withClosed }: { withClosed?: boolean }) => ({
      isFetchedPosition: true,
      totalPositionCount: withClosed ? 3 : 2,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("uses the open position count when closed positions are hidden", () => {
    render(<WalletMyPositionsHeader toggleClosed={jest.fn()} isClosed={false} />);

    expect(screen.getByRole("heading")).toHaveTextContent("Wallet:myPosi (2)");
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(mockUsePositionData).toHaveBeenCalledTimes(1);
    expect(mockUsePositionData).toHaveBeenCalledWith({
      withClosed: false,
      scopeId: "WalletMyPositionsHeader",
    });
  });

  it("uses the inclusive position count when closed positions are shown", () => {
    render(<WalletMyPositionsHeader toggleClosed={jest.fn()} isClosed={true} />);

    expect(screen.getByRole("heading")).toHaveTextContent("Wallet:myPosi (3)");
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(mockUsePositionData).toHaveBeenCalledTimes(1);
    expect(mockUsePositionData).toHaveBeenCalledWith({
      withClosed: true,
      scopeId: "WalletMyPositionsHeader",
    });
  });

  it("keeps the closed switch visible without relying on a current-page closed position", () => {
    mockUsePositionData.mockReturnValue({
      isFetchedPosition: true,
      totalPositionCount: 0,
    });

    render(<WalletMyPositionsHeader toggleClosed={jest.fn()} isClosed={false} />);

    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });
});
