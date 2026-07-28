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
