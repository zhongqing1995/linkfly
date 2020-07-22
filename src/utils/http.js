import axios from "axios";
import router from "../router";
import { Notice } from "iview";
// axios.defaults.timeout = 5000;
axios.defaults.baseURL = "https://www.linkeda.net";

//http request 拦截器
axios.interceptors.request.use();
//http response 拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Notices(error.response.status)
    return Promise.reject(error);
  }
);
export function fromData(url, datas) {
  return new Promise((resolve, reject) => {
    let config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    };
    axios
      .post(url, datas, config)
      .then(function(response) {
        if (response.data.code == 2) {
          Notice.error({
            title: "系统提醒",
            desc: response.data.msg_customer
          });
          router.push("/");
        } else {
          resolve(response.data);
        }
      })
      .catch(err => {});
  });
} //fromData请求
/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function fetch(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(response => {
        if (response.data.code == 2) {
          Notice.error({
            title: "系统提醒",
            desc: response.data.msg_customer
          });
          router.push("/");
        } else {
          resolve(response.data);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}
/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    var token = sessionStorage.getItem("token")
      ? sessionStorage.getItem("token")
      : "";
    axios.post(url + token, data).then(
      response => {
        if (response.data.code == 2) {
          Notice.error({
            title: "系统提醒",
            desc: response.data.msg_customer
          });
          router.push("/");
        } else {
          resolve(response.data);
        }
      },
      err => {
        reject(err);
      }
    );
  });
}
export function fromdata(url, data) {
  return new Promise((resolve, reject) => {
    let config = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };
    axios.post(url, data, config).then(
      response => {
        if (response.data.code == 2) {
          Notice.error({
            title: "系统提醒",
            desc: response.data.msg_customer
          });
          router.push("/");
        } else {
          resolve(response.data);
        }
      },
      err => {
        reject(err);
      }
    );
  });
}

export function fromdata2(url, data) {
  var token = sessionStorage.getItem("token")
    ? sessionStorage.getItem("token")
    : "";
  return new Promise((resolve, reject) => {
    let config = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };
    axios.post(url + token, data, config).then(
      response => {
        if (response.data.code == 2) {
          Notice.error({
            title: "系统提醒",
            desc: response.data.msg_customer
          });
          router.push("/");
        } else {
          resolve(response.data);
        }
      },
      err => {
        reject(err);
      }
    );
  });
}

function Notices(status) {
  switch (status) {
    case 404:
      Notice.error({
        title: "系统提醒",
        desc: "请求地址不存在"
      });
      break;
    case 500:
      Notice.error({
        title: "系统提醒",
        desc: "服务器错误"
      });
  }
}
