import * as yup from "yup";
import { isValidAddress } from "./validation-utils";
import { TFunction } from "i18next";

export const getCreateProposalValidation = (t: TFunction) =>
  yup
    .object()
    .shape({
      title: yup.string().trim().required(t("Governance:proposal.validation.required.title")),
      description: yup.string().trim().required(t("Governance:proposal.validation.required.desc")),
    })
    .required();

export const getCreateProposalCommunityPoolSpendValidation = (t: TFunction) =>
  yup
    .object()
    .shape({
      title: yup.string().trim().required(t("Governance:proposal.validation.required.title")),
      description: yup.string().trim().required(t("Governance:proposal.validation.required.desc")),
      recipientAddress: yup
        .string()
        .trim()
        .required(t("Governance:proposal.validation.required.recipient"))
        .test("is-valid", t("Governance:proposal.validation.invalid.address"), value => isValidAddress(value)),
      amount: yup
        .number()
        .typeError(t("Governance:proposal.validation.required.amount"))
        .required(t("Governance:proposal.validation.required.amount")),
    })
    .required();

const variableSchema = {
  pkgPath: yup.string(),
  func: yup.string(),
  param: yup.string(),
};

export const getCreateProposalChangeParameterValidation = (t: TFunction) =>
  yup
    .object()
    .shape({
      title: yup.string().trim().required(t("Governance:proposal.validation.required.title")),
      description: yup.string().trim().required(t("Governance:proposal.validation.required.desc")),
    })
    .required();

export const getCreateProposalParameterValidation = (
  t: TFunction,
  executableFunctions: {
    pkgPath: string;
    funcName: string;
    paramNum: number;
  }[],
) =>
  yup
    .array()
    .min(1, t("Governance:proposal.validation.required.oneChange"))
    .of(
      yup
        .object()
        .shape(variableSchema)
        .test("check-valid", t("Governance:proposal.validation.required.argument"), item => {
          if (!item) return true;

          if (
            item.pkgPath &&
            item.pkgPath.trim() !== "" &&
            item.func &&
            item.func.trim() !== "" &&
            (!item.param || item.param.trim() === "")
          ) {
            return false;
          }

          return true;
        })
        .test("check-parameter", t("Governance:proposal.validation.invalid.argument"), item => {
          if (!item.param) {
            return true;
          }

          const currentFunction = executableFunctions.find(
            func => func.pkgPath === item.pkgPath && func.funcName === item.func,
          );
          if (!currentFunction) {
            return true;
          }

          return item.param.split(",").length === currentFunction.paramNum;
        }),
    )
    .required();
