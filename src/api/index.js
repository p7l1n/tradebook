import axios from "axios";
import store from "@/store";
// axios.defaults.withCredentials = true;

const BASE_URL = process.env.VUE_APP_API_URL;
import { ElNotification } from "element-plus";

export const postQuery = async (url, params = {}) => {
  let res;

  try {
    res = await axios.post(`${BASE_URL}${url}`, params, {
      headers: {
        // withCredentials: true,
        "content-type": "application/json",
        Authorization: `Bearer ${store.getters["auth/user"]?.jwt || ""}`,
      },
    });

    if (res.data) {
      return res.data;
    }
    return {
      error: "Empty response from API",
    };
  } catch (err) {
    ElNotification({
      title: "Error POST",
      message: err?.response?.data[0]?.description || "Unknown API error",
      type: "error",
    });
    return {
      error: err?.response?.data[0]?.description || "Unknown API error",
    };
  }
};

export const putQuery = async (url, params = {}) => {
  let res;
  delete params.id;

  try {
    res = await axios.put(`${BASE_URL}${url}`, params, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${store.getters["auth/user"]?.jwt || ""}`,
      },
    });

    if (res.data) {
      return res.data;
    }
    return {
      error: "Empty response from API",
    };
  } catch (err) {
    ElNotification({
      title: "Error PUT",
      message: err?.response?.data?.error || "Unknown API error",
      type: "error",
    });
    return {
      error: err?.response?.data?.error || "Unknown API error",
    };
  }
};

export const deleteQuery = async (url) => {
  let res;

  try {
    res = await axios.delete(`${BASE_URL}${url}`, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${store.getters["auth/user"]?.jwt || ""}`,
      },
    });
    if (res.data) {
      return res.data;
    }
    return {
      error: "Empty response from API",
    };
  } catch (err) {
    ElNotification({
      title: "Error DELETE",
      message: err?.response?.data?.error || "Unknown API error",
      type: "error",
    });
    return {
      error: err?.response?.data?.error || "Unknown API error",
    };
  }
};

export const getQuery = async (url, params = {}) => {
  let res;

  try {
    res = await axios(`${BASE_URL}${url}`, {
      method: "GET",
      data: {
        params,
      },
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${store.getters["auth/user"]?.jwt || ""}`,
      },
    });
    if (res.data) {
      return res.data;
    }
    return {
      error: "Empty response from API",
    };
  } catch (err) {
    ElNotification({
      title: "Error GET",
      message: err?.response?.data?.error || "Unknown API error",
      type: "error",
    });
    return {
      error: err?.response?.data?.error || "Unknown API error",
    };
  }
};
