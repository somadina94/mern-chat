import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://127.0.0.1:7000/api/v1",
// });

const axiosInstance = axios.create({
  baseURL: "https://mernchatapi.jahbyte.com/api/v1/",
});

export const createAccount = async (data) => {
  try {
    const res = await axiosInstance({
      method: "POST",
      url: "users/signUp",
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
      url: "users/login",
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
      url: "users/logout",
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const getChatList = async (jwt) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: "messages/chat-list",
      headers: {
        authorization: `jwt=${jwt}`,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const getMessages = async (receiverId, jwt) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `messages/getMessages/${receiverId}`,
      headers: {
        authorization: `jwt=${jwt}`,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const getUser = async (id, jwt) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `users/getUser/${id}`,
      headers: {
        authorization: `jwt=${jwt}`,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};
