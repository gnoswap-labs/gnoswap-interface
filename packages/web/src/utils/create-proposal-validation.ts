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

export const getCreateProposalChangeParameterValidation = () =>
  yup
    .object()
    .shape({
      title: yup.string().trim().required("Title is required"),
      description: yup.string().trim().required("Description is required"),
      variable: yup.array().of(yup.object().shape(variableSchema)).min(1, "At least one change is reqruied").test("check-valid", "Variable is not valid", value => {
        if (
          !value ||
          value[0].pkgPath === undefined ||
          value[0].pkgPath === "" ||
          value[0].func === undefined ||
          value[0].func === "" ||
          value[0].param === undefined ||
          value[0].param === ""
        )
          return false;
        return value.every((item) => item.param !== undefined && item.param !== "");
      }),
    })
    .required();
