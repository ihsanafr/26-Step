import api from "./api";

export interface FeedbackData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const feedbackService = {
  async submit(data: FeedbackData) {
    const response = await api.post("/feedback", data);
    return response.data;
  },
};
