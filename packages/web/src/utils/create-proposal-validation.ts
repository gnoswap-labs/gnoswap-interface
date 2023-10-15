import * as yup from "yup";

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
      recipientAddress: yup.string().trim().required("Recipient is required"),
      amount: yup.string().trim().required("Amount is required"),
    })
    .required();

const variableSchema = {
  subspace: yup.string().trim().required("Subspace is required"),
  key: yup.string().trim().required("Key is required"),
  value: yup.string().trim().required("Value is required"),
};

export const getCreateProposalChangeParameterValidation = () =>
  yup
    .object()
    .shape({
      title: yup.string().trim().required("Title is required"),
      description: yup.string().trim().required("Description is required"),
      variable: yup.array().of(yup.object().shape(variableSchema)),
    })
    .required();
