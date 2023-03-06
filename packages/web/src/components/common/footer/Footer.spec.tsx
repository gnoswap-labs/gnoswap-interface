import Footer from "./Footer";
import { render } from "@testing-library/react";

describe("Footer Component", () => {
  it("should render", () => {
    render(<Footer label="test" />);
  });
});
