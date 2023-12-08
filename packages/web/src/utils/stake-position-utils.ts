export const convertLargePrice = (price: string, maximumFractionDigits?: number) => {
  if (Math.floor(Number(price)).toString().length < 4) {
    return Number(price).toLocaleString("en-US", { maximumFractionDigits: maximumFractionDigits || 2, minimumFractionDigits: 2});
  } else {
    const temp = Math.floor(Number(price));
    if (temp >= 1e9) {
      return (
        (temp / 1e9).toLocaleString("en-US", { maximumFractionDigits: maximumFractionDigits || 2, minimumFractionDigits: 2}) + "B"
      );
    }
    if (temp >= 1e6) {
      return (
        (temp / 1e6).toLocaleString("en-US", { maximumFractionDigits: maximumFractionDigits || 2, minimumFractionDigits: 2}) + "M"
      );
    }
    if (temp >= 1e3) {
      return (
        (temp / 1e3).toLocaleString("en-US", { maximumFractionDigits: maximumFractionDigits || 2, minimumFractionDigits: 2}) + "K"
      );
    }
    return Number(price).toLocaleString("en-US", { maximumFractionDigits: maximumFractionDigits || 2, minimumFractionDigits: 2});
  }
};
