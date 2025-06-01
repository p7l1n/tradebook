import axios from "axios";
import store from "@/store";
let currentNotification;
// axios.defaults.withCredentials = true;

const objectToQueryParams = (obj) => {
  const clientsList = store.getters["clients/clients"];
  const params = new URLSearchParams();

  const currencyMap = {
    RUB: 1,
    USD: 2,
    EUR: 3,
    WUSD: 4,
    USDT: 0,
  };

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      if (key === "status") {
        // Преобразуем статус в числовое значение
        const statusValue =
          value === "Исполнено" ? 1 : value === "Не исполнено" ? 0 : value;
        params.append(key, statusValue);
      } else if (key === "inCurrencyId" || key === "outCurrencyId") {
        // Преобразуем валюту в числовое значение
        const currencyValues = Array.isArray(value) ? value : [value];
        currencyValues.forEach((currency) => {
          const currencyValue =
            currencyMap[currency] !== undefined
              ? currencyMap[currency]
              : currency;
          params.append(key, currencyValue);
        });
      } else if (Array.isArray(value)) {
        // Для массивов добавляем каждый элемент отдельно
        if (key === "clientId" || key === "operatorId") {
          // Преобразуем имена в ID
          const ids = value
            .map((name) => {
              const client = clientsList.find((c) => c.name === name);
              return client ? client.id : null;
            })
            .filter((id) => id !== null);

          ids.forEach((id) => params.append(key, id));
        } else {
          value.forEach((item) => params.append(key, item));
        }
      } else {
        params.append(key, value);
      }
    }
  }

  return params.toString();
};

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
        if (currentNotification) {
          currentNotification.close();
        }
        currentNotification = ElNotification({
          title: routes[url],
          message: `Запись добавлена`,
          type: "success",
          duration: 500,
          onClose: () => {
            currentNotification = null;
          },
        });
      }
      return res.data;
    }

    return {
      error: "Empty response from API",
    };
  } catch (err) {
    if (currentNotification) {
      currentNotification.close();
    }
    currentNotification = ElNotification({
      title: "Error POST",
      message: getError(err),
      type: "error",
      duration: 500,
      onClose: () => {
        currentNotification = null;
      },
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
      if (url.split("/")[0] !== "Orders") {
        // не показывать сообщение для заявок
        if (currentNotification) {
          currentNotification.close();
        }
        currentNotification = ElNotification({
          title: routes[url.split("/")[0]],
          message: `Запись изменена`,
          type: "warning",
          duration: 500,
          onClose: () => {
            currentNotification = null;
          },
        });
      }
    }

    if (res.data) {
      return res.data;
    }
    return {
      error: "Empty response from API",
    };
  } catch (err) {
    if (currentNotification) {
      currentNotification.close();
    }
    currentNotification = ElNotification({
      title: "Error PUT",
      message: getError(err),
      type: "error",
      duration: 500,
      onClose: () => {
        currentNotification = null;
      },
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
      if (currentNotification) {
        currentNotification.close();
      }
      currentNotification = ElNotification({
        title: routes[url.split("/")[0]],
        message: `Запись удалена`,
        type: "error",
        duration: 500,
        onClose: () => {
          currentNotification = null;
        },
      });
    }

    if (res.data) {
      return res.data;
    }
    return {
      error: "Empty response from API",
    };
  } catch (err) {
    if (currentNotification) {
      currentNotification.close();
    }
    currentNotification = ElNotification({
      title: "Error DELETE",
      message: getError(err),
      duration: 500,
      type: "error",
      onClose: () => {
        currentNotification = null;
      },
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
  const localParams = { ...params };
  delete localParams.activeTabIndex;
  delete localParams.searchStr;
  delete localParams.showStats;
  delete localParams.showPayed;
  delete localParams.date;
  delete localParams.status;
  delete localParams.cacheIdsForLayer2Filter;

  if (isAdmin) {
    localParams.organizationId = organizationId;
  }

  if (localParams.from) {
    localParams.from = Math.floor(
      (+new Date(localParams.from) + 10800000) / 1000
    );
  }

  if (localParams.to) {
    localParams.to = Math.floor((+new Date(localParams.to) + 86400000) / 1000);
  }
  localParams.pageSize = 100000;

  const queryParamsString = objectToQueryParams(localParams);
  if (queryParamsString) {
    urlQuery = `?${queryParamsString}`;
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
    if (currentNotification) {
      currentNotification.close();
    }
    currentNotification = ElNotification({
      title: "Error GET",
      message: getError(err),
      type: "error",
      duration: 500,
      onClose: () => {
        currentNotification = null;
      },
    });
    return {
      error: getError(err),
    };
  }
};
