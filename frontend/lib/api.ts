import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getOAuthGoogleUrl = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/v1/oauth/google`, {
      withCredentials: true,
    });

    const googleOAuthUrl = res.data.data.url;
    return googleOAuthUrl;
  } catch (error) {
    console.log(error);
  }
};
interface registerUserInput {
  email: string;
  password: string;
  confirmPassword: string;
  captchaToken: string;
}
export async function registerUser(data: registerUserInput) {
  const response = await axios.post(
    `${BACKEND_URL}/api/v1/auth/register`,
    data,
    { withCredentials: true },
  );
  return response.data;
}
interface loginUserInput {
  email: string;
  password: string;
  captchaToken?: string;
}
export async function loginUser(data: loginUserInput) {
  const response = await axios.post(`${BACKEND_URL}/api/v1/auth/login`, data, {
    withCredentials: true,
  });
  return response.data;
}
