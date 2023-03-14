import SearchInput from "./SearchInput";
import { render } from "@testing-library/react";

describe("SearchInput Component", () => {
  it("should render", () => {
    render(<SearchInput width={400} height={48} placeholder="Search" />);
  });
});
