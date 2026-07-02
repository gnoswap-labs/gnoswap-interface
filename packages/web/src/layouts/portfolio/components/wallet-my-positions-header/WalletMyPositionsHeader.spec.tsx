import { render } from "@testing-library/react";

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
    mockUsePositionData.mockReturnValue({
      positions: [],
      isFetchedPosition: true,
      totalPositionCount: 1,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("requests only open positions when closed positions are hidden", () => {
    render(<WalletMyPositionsHeader toggleClosed={jest.fn()} isClosed={false} />);

    expect(mockUsePositionData).toHaveBeenCalledWith({
      withClosed: false,
      scopeId: "WalletMyPositionsHeader",
    });
  });

  it("requests open and closed positions when closed positions are shown", () => {
    render(<WalletMyPositionsHeader toggleClosed={jest.fn()} isClosed={true} />);

    expect(mockUsePositionData).toHaveBeenCalledWith({
      withClosed: true,
      scopeId: "WalletMyPositionsHeader",
    });
  });
});
