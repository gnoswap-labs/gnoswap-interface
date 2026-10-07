import { render, screen } from "@testing-library/react";

import { ReceiveWugnotContent } from "./ReceiveWugnotContent";

jest.mock("@constants/environment.constant", () => ({
  WRAPPED_GNOT_PATH: "gno.land/r/gnoland/wugnot",
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@components/common/icons/IconArrowRight", () => {
  const IconArrowRight = () => <span data-testid="arrow-right" />;
  return IconArrowRight;
});

jest.mock("@components/common/icons/IconWrap", () => {
  const IconWrap = ({ className }: { className?: string }) => <span className={className} data-testid="wrap-icon" />;
  return IconWrap;
});

describe("ReceiveWugnotContent", () => {
  it("opens the unwrap swap route in the current tab", () => {
    render(<ReceiveWugnotContent onClick={jest.fn()} close={jest.fn()} />);

    const link = screen.getByRole("link", { name: /Modal:toast.receive-wugnot.link/i });

    expect(link).toHaveAttribute("href", "/swap?from=gno.land/r/gnoland/wugnot&to=ugnot");
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });
});
