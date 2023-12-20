export const convertLargePrice = (price: string, maximumFractionDigits?: number) => {
  if (Number.isNaN(Number(price))) return "-";
  if (Math.floor(Number(price)).toString().length < 7) {
    return Number(price).toLocaleString("en-US", { maximumFractionDigits: maximumFractionDigits || 2, minimumFractionDigits: 2});
  } else {
    const temp = Math.floor(Number(price));
    if (temp >= 1e12) {
      return (
        (temp / 1e12).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2}) + "B"
      );
    }
    if (temp >= 1e9) {
      return (
        (temp / 1e9).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2}) + "B"
      );
    }
    if (temp >= 1e6) {
      return (
        (temp / 1e6).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2}) + "M"
      );
    }
    return Number(price).toLocaleString("en-US", { maximumFractionDigits: maximumFractionDigits || 2, minimumFractionDigits: 2});
  }
};

export const formatUsdNumber = (price: string, maximumFractionDigits?: number) => {
  if (convertLargePrice(price, maximumFractionDigits) === "-") {
    return "-";
  }
  return `$${convertLargePrice(price, maximumFractionDigits)}`;
};
