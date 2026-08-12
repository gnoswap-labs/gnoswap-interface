type AprValue = number | string | null | undefined;

export const calculateEstimatedAPR = (feeApr: AprValue, feeBoost: AprValue): number | null => {
  if (
    feeApr === null ||
    feeApr === undefined ||
    feeApr === "" ||
    feeBoost === null ||
    feeBoost === undefined ||
    feeBoost === ""
  ) {
    return null;
  }

  const feeAprNumber = Number(feeApr);
  const feeBoostNumber = Number(feeBoost);

  if (!Number.isFinite(feeAprNumber) || !Number.isFinite(feeBoostNumber)) {
    return null;
  }

  return feeAprNumber * feeBoostNumber;
};
