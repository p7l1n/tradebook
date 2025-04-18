import axios from "axios";
import store from "@/store";
// axios.defaults.withCredentials = true;

const routes = {
  Notes: "Журнал/Тетрадь",
  Clients: "Контрагенты",
  Orders: "Заявки",
  Organizations: "Кассы",
  // Claims: "Пользователи",
};

const getError = (err) => {
  return (
    err?.response?.data?.title ||
    err?.response?.data[0]?.description ||
    err?.response?.statusText || // err.response.status === 401
    err?.response?.data ||
    "Unknown API error"
  );
};

const BASE_URL = process.env.VUE_APP_API_URL;
import { ElNotification } from "element-plus";

export const postQuery = async (url, params = {}) => {
  const isAdmin = store.getters["auth/isAdmin"];
  const organizationId = store.getters["settings/organizationId"];

  let res;

  if (isAdmin) {
    params.organizationId = organizationId;
  }
  try {
    res = await axios.post(`${BASE_URL}${url}`, params, {
      headers: {
        // withCredentials: true,
        "content-type": "application/json",
        Authorization: `Bearer ${store.getters["auth/user"]?.jwt || ""}`,
      },
    });

    if (res.data) {
      if (routes[url]) {
        ElNotification({
          title: routes[url],
          message: `Запись добавлена`,
          type: "success",
        });
      }
      return res.data;
    }

    return {
      error: "Empty response from API",
    };
  } catch (err) {
    ElNotification({
      title: "Error POST",
      message: getError(err),
      type: "error",
    });
    return {
      error: getError(err),
    };
  }
};

export const putQuery = async (url, params = {}) => {
  let res;

  delete params.id;
  const isAdmin = store.getters["auth/isAdmin"];
  const organizationId = store.getters["settings/organizationId"];

  if (isAdmin) {
    params.organizationId = organizationId;
  }

  try {
    res = await axios.put(`${BASE_URL}${url}`, params, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${store.getters["auth/user"]?.jwt || ""}`,
      },
    });

    if (routes[url.split("/")[0]]) {
      ElNotification({
        title: routes[url.split("/")[0]],
        message: `Запись изменена`,
        type: "warning",
      });
    }

    if (res.data) {
      return res.data;
    }
    return {
      error: "Empty response from API",
    };
  } catch (err) {
    ElNotification({
      title: "Error PUT",
      message: getError(err),
      type: "error",
    });
    return {
      error: getError(err),
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

    if (routes[url.split("/")[0]]) {
      ElNotification({
        title: routes[url.split("/")[0]],
        message: `Запись удалена`,
        type: "error",
      });
    }

    if (res.data) {
      return res.data;
    }
    return {
      error: "Empty response from API",
    };
  } catch (err) {
    ElNotification({
      title: "Error DELETE",
      message: getError(err),
      type: "error",
    });
    return {
      error: getError(err),
    };
  }
};

export const getQuery = async (url, params = {}) => {
  const isAdmin = store.getters["auth/isAdmin"];
  const organizationId = store.getters["settings/organizationId"];

  let res;
  let urlQuery = "";

  if (isAdmin) {
    params.organizationId = organizationId;
    urlQuery = `?organizationId=${organizationId}`;
  }

  try {
    res = await axios(`${BASE_URL}${url}${urlQuery}`, {
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
      message: getError(err),
      type: "error",
    });
    return {
      error: getError(err),
    };
  }
};
