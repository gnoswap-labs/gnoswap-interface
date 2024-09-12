export interface SendProposeParameterChangeRequest {
  title: string;
  description: string;
  variables: {
    pkgPath: string;
    func: string;
    param: string;
  }[];
}
