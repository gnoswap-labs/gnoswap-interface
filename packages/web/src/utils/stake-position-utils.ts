export const convertToMB = (price: string, maximumFractionDigits?: number) => {
  if (Number.isNaN(Number(price))) return "-";
  if (Math.floor(Number(price)).toString().length < 7) {
    if (Number(price) < 1) return price;
    return Number(price).toLocaleString("en-US", {
      maximumFractionDigits: maximumFractionDigits || 2,
      minimumFractionDigits: 2,
    });
  } else {
    const temp = Math.floor(Number(price));
    if (temp >= 1e9) {
      return (
        (temp / 1e9).toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) + "B"
      );
    }
    if (temp >= 1e6) {
      return (
        (temp / 1e6).toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) + "M"
      );
    }
    return Number(price).toLocaleString("en-US", {
      maximumFractionDigits: maximumFractionDigits || 2,
      minimumFractionDigits: 2,
    });
  }
};

export const convertToKMB = (
  price: string,
  maximumFractionDigits?: number,
  minimumFractionDigits?: number,
) => {
  if (Number.isNaN(Number(price))) return "-";
  if (Math.floor(Number(price)).toString().length < 4) {
    if (Number.isInteger(Number(price))) return price;
    if (Number(price) < 0.000001 && Number(price) !== 0) return "0.000001";
    if (Number(price) < 1) return `${Number(Number(price).toFixed(6))}`;
    return Number(price).toLocaleString("en-US", {
      maximumFractionDigits: maximumFractionDigits ?? 2,
      minimumFractionDigits: minimumFractionDigits ?? 2,
    });
  } else {
    const temp = Math.floor(Number(price));
    if (temp >= 1e9) {
      if (temp > 999.99 * 1e9) return "999.99B";
      return (
        (temp / 1e9).toLocaleString("en-US", {
          maximumFractionDigits: maximumFractionDigits ?? 2,
          minimumFractionDigits: minimumFractionDigits ?? 2,
        }) + "B"
      );
    }
    if (temp >= 1e6) {
      return (
        (temp / 1e6).toLocaleString("en-US", {
          maximumFractionDigits: maximumFractionDigits ?? 2,
          minimumFractionDigits: minimumFractionDigits ?? 2,
        }) + "M"
      );
    }
    if (temp >= 1e3) {
      return (
        (temp / 1e3).toLocaleString("en-US", {
          maximumFractionDigits: maximumFractionDigits ?? 2,
          minimumFractionDigits: minimumFractionDigits ?? 2,
        }) + "K"
      );
    }
    return Number.isInteger(price) ? `${Number(price)}` : Number(price).toLocaleString("en-US", {
      maximumFractionDigits: maximumFractionDigits ?? 2,
      minimumFractionDigits: minimumFractionDigits ?? 2,
    });
  }
};

export const formatUsdNumber = (
  price: string,
  maximumFractionDigits?: number,
  isKMB?: boolean,
) => {
  const func = isKMB ? convertToKMB : convertToMB;
  if (func(price, maximumFractionDigits) === "-") {
    return "-";
  }
  return `$${func(price, maximumFractionDigits)}`;
};
