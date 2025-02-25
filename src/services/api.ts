import axios from "./axios.customize";

export const registerAPI = (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  const urlBackend = `/api/v1/user/register`;
  return axios.post<IBackendRes<IRegister>>(urlBackend, { fullName, email, password, phone });
};
