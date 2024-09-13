import * as yup from "yup";
import { addressValidationCheck } from "./validation-utils";

export const getCreateProposalValidation = () =>
  yup
    .object()
    .shape({
      title: yup.string().trim().required("Title is required"),
      description: yup.string().trim().required("Description is required"),
    })
    .required();

export const getCreateProposalCommunityPoolSpendValidation = () =>
  yup
    .object()
    .shape({
      title: yup.string().trim().required("Title is required"),
      description: yup.string().trim().required("Description is required"),
      recipientAddress: yup
        .string()
        .trim()
        .required("Recipient is required")
        .test("is-valid", "Address is not valid", value =>
          addressValidationCheck(value),
        ),
      amount: yup
        .number()
        .typeError("Amount is required")
        .required("Amount is required"),
    })
    .required();

const variableSchema = {
  pkgPath: yup.string(),
  func: yup.string(),
  param: yup.string(),
};

export const getCreateProposalChangeParameterValidation = (
  executableFunctions: {
    pkgPath: string;
    funcName: string;
    paramNum: number;
  }[],
) =>
  yup
    .object()
    .shape({
      title: yup.string().trim().required("Title is required"),
      description: yup.string().trim().required("Description is required"),
      variable: yup
        .array()
        .min(1, "At least one change is reqruied")
        .of(
          yup
            .object()
            .shape(variableSchema)
            .test("check-valid", "Variable is not valid", item => {
              if (!item) return false;

              return (
                item.pkgPath !== undefined &&
                item.pkgPath !== "" &&
                item.func !== undefined &&
                item.func !== "" &&
                item.param !== undefined &&
                item.param !== ""
              );
            })
            .test("check-parameter", "Invalid parameters", item => {
              if (!item.param) {
                return false;
              }

              const currentFunction = executableFunctions.find(
                func => func.pkgPath === item.pkgPath,
              );
              if (!currentFunction) {
                return false;
              }

              return item.param.split(",").length === currentFunction.paramNum;
            }),
        ),
    })
    .required();

export const getCreateProposalParameterValidation = (
  executableFunctions: {
    pkgPath: string;
    funcName: string;
    paramNum: number;
  }[],
) =>
  yup
    .array()
    .min(1, "At least one change is reqruied")
    .of(
      yup
        .object()
        .shape(variableSchema)
        .test("check-valid", "Variable is not valid", item => {
          if (!item) return true;
          if (
            (item.pkgPath === undefined || item.pkgPath === "") &&
            (item.func === undefined || item.func === "") &&
            (item.param === undefined || item.param === "")
          ) {
            return true;
          }

          return (
            item.pkgPath !== undefined &&
            item.pkgPath !== "" &&
            item.func !== undefined &&
            item.func !== "" &&
            item.param !== undefined &&
            item.param !== ""
          );
        })
        .test("check-parameter", "Invalid parameters", item => {
          if (!item.param) {
            return true;
          }

          const currentFunction = executableFunctions.find(
            func => func.pkgPath === item.pkgPath,
          );
          if (!currentFunction) {
            return true;
          }

          return item.param.split(",").length === currentFunction.paramNum;
        }),
    )
    .required();
