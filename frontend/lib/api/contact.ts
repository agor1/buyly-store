import api from "./api";

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export const sendContactMessage = async (payload: ContactPayload) => {
  const response = await api.post("/contact", payload);
  return response.data;
};
