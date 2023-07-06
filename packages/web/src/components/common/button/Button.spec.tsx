import Button from "./Button";
import { render } from "@testing-library/react";
import { ButtonHierarchy } from "./Button";
import IconDownload from "@components/common/icons/IconDownload";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("Button Component", () => {
  it("Primary button", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <Button
            text="Primary"
            style={{
              hierarchy: ButtonHierarchy.Primary,
              width: 130,
              height: 50,
            }}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });

  it("Icon button", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <Button
            leftIcon={<IconDownload />}
            text="Icon Button"
            style={{
              bgColor: "gray50",
              width: 180,
              height: 50,
              justify: "space-between",
              padding: "0px 10px",
              textColor: "colorGreen",
            }}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });

  it("Full width button", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <Button
            leftIcon={<IconDownload />}
            text="Full width button"
            style={{
              bgColor: "gray40",
              fullWidth: true,
              height: 50,
              textColor: "colorWhite",
            }}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
