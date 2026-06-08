import SelectTab from "./SelectTab";
import { fireEvent, render, screen } from "@testing-library/react";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { Provider as JotaiProvider } from "jotai";

describe("SelectTab Component", () => {
  it("SelectTab render", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SelectTab selectType={"7D"} list={["All", "Incentivized", "Non-Incentivized"]} onClick={() => {}} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });

  it("renders display labels while preserving raw values for clicks", () => {
    let clickedType = "";

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SelectTab
            selectType="LONGTOKEN01"
            list={[
              { value: "LONGTOKEN01", display: "LONGTOKEN…" },
              { value: "ANOTHERLONGTOKEN", display: "ANOTHERLO…" },
            ]}
            onClick={(type: string) => {
              clickedType = type;
            }}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    expect((screen.getByText("LONGTOKEN…") as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByText("ANOTHERLO…"));
    expect(clickedType).toBe("ANOTHERLONGTOKEN");
  });
});
