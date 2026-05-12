export type ApiResponse<T> = {
  status: boolean;
  success?: boolean;
  message?: string;
  data: T;
};


export type ApiMessageResponse = {
  status: boolean
  message: string;
};
