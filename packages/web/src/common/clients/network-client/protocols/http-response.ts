export interface HttpResponse<R> {
  status: number;
  message: string;
  data: R;
}
