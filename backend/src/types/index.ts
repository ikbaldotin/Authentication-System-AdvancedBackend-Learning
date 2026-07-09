export type ApiResone<T> = {
  success: boolean;
  message: string;
  data?: T;
};
