export {};

declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    results: T[];
  }

  interface IRegister {
    id: string;
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }
}
