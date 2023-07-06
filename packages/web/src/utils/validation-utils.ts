import { ErrorResponse } from "@common/errors/response";

export function addressValidationCheck(v: string): boolean {
  const startStringCheck = /^g1/;
  const atozAndNumberCheck = /^[a-z0-9]{40}$/;
  return startStringCheck.test(v) && atozAndNumberCheck.test(v) ? true : false;
}

export function isErrorResponse(resposne: any): resposne is ErrorResponse {
  return resposne?.isError === true;
}
