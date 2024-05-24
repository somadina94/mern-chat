import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:7000/api/v1",
});

export const createAccount = async (data) => {
  try {
    const res = await axiosInstance({
      method: "POST",
      url: "user/signUp",
      data,
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const logIn = async (data) => {
  try {
    const res = await axiosInstance({
      method: "POST",
      url: "user/login",
      data,
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const logOut = async () => {
  try {
    const res = await axiosInstance({
      method: "POST",
      url: "user/logout",
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};
