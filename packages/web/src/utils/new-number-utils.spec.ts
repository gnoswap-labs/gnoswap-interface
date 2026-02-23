import { formatOtherPrice, formatPoolPairAmount, formatRate, formatTokenAmount } from "./new-number-utils";

describe("formatOtherPrice", () => {
  describe("exact zero should display as $0", () => {
    it("returns '$0' for exactly 0", () => {
      expect(formatOtherPrice(0)).toBe("$0");
    });

    it("returns '$0' for string '0'", () => {
      expect(formatOtherPrice("0")).toBe("$0");
    });
  });

  describe("dust values (< 1e-6) should display as $0, not <$0.01", () => {
    it("returns '$0' for 0.000001 (at threshold boundary)", () => {
      expect(formatOtherPrice(0.000001)).toBe("$0");
    });

    it("returns '$0' for 1e-10", () => {
      expect(formatOtherPrice(1e-10)).toBe("$0");
    });

    it("returns '$0' for 1e-18", () => {
      expect(formatOtherPrice(1e-18)).toBe("$0");
    });

    it("returns '$0' for 9.99e-7 (just under threshold)", () => {
      expect(formatOtherPrice(9.99e-7)).toBe("$0");
    });
  });

  describe("small but meaningful values should display as <$0.01", () => {
    it("returns '<$0.01' for 0.001", () => {
      expect(formatOtherPrice(0.001)).toBe("<$0.01");
    });

    it("returns '<$0.01' for 0.009", () => {
      expect(formatOtherPrice(0.009)).toBe("<$0.01");
    });

    it("returns '<$0.01' for 0.0099999", () => {
      expect(formatOtherPrice(0.0099999)).toBe("<$0.01");
    });
  });

  describe("values >= 0.01 display normally", () => {
    it("returns '$0.01' for exactly 0.01", () => {
      expect(formatOtherPrice(0.01)).toBe("$0.01");
    });

    it("returns '$0.05' for 0.05", () => {
      expect(formatOtherPrice(0.05)).toBe("$0.05");
    });

    it("returns '$1.23' for 1.23", () => {
      expect(formatOtherPrice(1.23)).toBe("$1.23");
    });
  });

  describe("null / undefined / empty returns '-'", () => {
    it("returns '-' for null", () => {
      expect(formatOtherPrice(null)).toBe("-");
    });

    it("returns '-' for undefined", () => {
      expect(formatOtherPrice(undefined)).toBe("-");
    });

    it("returns '-' for empty string", () => {
      expect(formatOtherPrice("")).toBe("-");
    });
  });

  describe("zeroAsEmpty option", () => {
    it("returns '-' for dust value when zeroAsEmpty is true", () => {
      expect(formatOtherPrice(1e-10, { zeroAsEmpty: true })).toBe("-");
    });

    it("returns '-' for 0 when zeroAsEmpty is true", () => {
      expect(formatOtherPrice(0, { zeroAsEmpty: true })).toBe("-");
    });
  });
});

describe("formatPoolPairAmount", () => {
  describe("dust values should display as 0", () => {
    it("returns '0' for 0.000001", () => {
      expect(formatPoolPairAmount(0.000001)).toBe("0");
    });

    it("returns '0' for 1e-10", () => {
      expect(formatPoolPairAmount(1e-10)).toBe("0");
    });
  });

  it("returns '0' for exactly 0", () => {
    expect(formatPoolPairAmount(0)).toBe("0");
  });

  it("returns '<0.01' for meaningful small value like 0.005", () => {
    expect(formatPoolPairAmount(0.005)).toBe("<0.01");
  });
});

describe("formatRate", () => {
  describe("dust values should display as 0%", () => {
    it("returns '0%' for 0.000001", () => {
      expect(formatRate(0.000001)).toBe("0%");
    });

    it("returns '0%' for 1e-10", () => {
      expect(formatRate(1e-10)).toBe("0%");
    });
  });

  it("returns '0%' for exactly 0", () => {
    expect(formatRate(0)).toBe("0%");
  });

  it("returns '<0.01%' for meaningful small value like 0.005", () => {
    expect(formatRate(0.005)).toBe("<0.01%");
  });
});

describe("formatTokenAmount", () => {
  describe("dust values should display as 0", () => {
    it("returns '0' for 0.000001 with decimals=2", () => {
      expect(formatTokenAmount(0.000001, { decimals: 2 })).toBe("0");
    });

    it("returns '0' for 1e-10", () => {
      expect(formatTokenAmount(1e-10, { decimals: 2 })).toBe("0");
    });
  });

  it("returns '0' for exactly 0", () => {
    expect(formatTokenAmount(0)).toBe("0");
  });

  it("returns '<0.01' for meaningful small value like 0.005 with decimals=2", () => {
    expect(formatTokenAmount(0.005, { decimals: 2 })).toBe("<0.01");
  });
});
