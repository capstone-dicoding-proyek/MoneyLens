import axios from 'axios';

export const loginWithGoogle = async (credentialResponse) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_URL_API}/user/google-login`, {
      token: credentialResponse.credential,
    });

    console.log(res.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
};