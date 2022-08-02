import { hashHistory } from 'react-router';
import axios from 'axios';
import qs from 'qs';
import lodash from 'lodash';
import pathToRegexp from 'path-to-regexp';
import { Toast } from 'antd-mobile';
import { _cg, _cr } from './cookie';
import { baseURL, userTag } from './config';

const { username, usertoken, userpower, userid, useravatar, userloginname, portalUserId, orgCode, portalUserName, doubleTake, portalHeadImg, portalHeadImgGK, portalToken, userLoginId, bkStudentNumber } = userTag,
  logoutWith401 = () => {
    _cr(`menu_${_cg(userLoginId)}`);
    _cr(username);
    _cr(userpower);
    _cr(usertoken);
    _cr(userid);
    _cr(useravatar);
    _cr(portalUserId);
    _cr(orgCode);
    _cr(portalUserName);
    _cr(doubleTake);
    _cr(portalHeadImg);
    _cr(portalHeadImgGK);
    _cr(portalToken);
    _cr(portalUserId);
    _cr(bkStudentNumber);
    _cr(userLoginId);
    _cr('oldAPP');
    cnDeleteAlias(_cg(userloginname), _cg(usertoken));
  },
  logoutWith302 = () => {
    _cr(`menu_${_cg(userLoginId)}`);
    _cr(portalUserId);
    _cr(orgCode);
    _cr(portalUserName);
    _cr(doubleTake);
    _cr(portalHeadImg);
    _cr(portalHeadImgGK);
    _cr(portalToken);
    _cr(userid);
    _cr(useravatar);
    _cr(usertoken);
    _cr(bkStudentNumber);
    _cr(userLoginId);
    _cr('oldAPP');
    cnDeleteAlias(_cg(userloginname), _cg(usertoken));
  };
axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true; // 设置带cookie
// axios.defaults.timeout = 15000; // 请求超时
const doDecode = (json) => {
  try {
    return eval(`(${json})`);
  } catch (e) {
    return json;
  }
};
const fetch = (options) => {
  let {
    method = 'get',
    data,
    fetchType = '',
    url,
    hasToken = true,
    hasCredentials = true
  } = options;

  const appendParams = {
    // header: {
    //   'Access-Control-Allow-Origin': 'http://localhost:8002'
    // }
  };
  // appendParams[usertoken] = _cg(usertoken)

  const cloneData = lodash.cloneDeep({ ...data, ...appendParams });

  try {
    let domin = '';
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domin = url.match(/[a-zA-z]+:\/\/[^/]*/)[0];
      url = url.slice(domin.length);
    }
    const match = pathToRegexp.parse(url);
    url = pathToRegexp.compile(url)(data);
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name];
      }
    }
    url = hasToken ? `${domin + url}/${_cg(usertoken)}` : domin + url;
  } catch (e) {
    Toast.offline(e.message);
  }
  if (data instanceof FormData) {
    axios.defaults.withCredentials = hasCredentials;
    return axios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  switch (method.toLowerCase()) {
    case 'get':
      if (fetchType === 'portal') {
        return axios.get(url, { params: cloneData },
          {
            headers: {
              'x-requested-with': 'XMLHttpRequest'
            }
          }
        );
      }
      if (fetchType === 'bjcb') {
        return axios.get(url, { params: cloneData },
          {
            headers: {
              token: portalToken
            }
          }
        );
      }
      if (fetchType === 'blob') {
        return axios({
          method: 'get',
          url,
          params: cloneData,
          responseType: 'blob'
        });
      }
      return axios.get(url, { params: cloneData }
      );
    case 'delete':
      return axios.delete(url, {
        data: cloneData
      });
    case 'post':
      if (fetchType === 'portal') {
        return axios.post(url, qs.stringify(cloneData, {
            indices: false
          }),
          {
            headers: {
              'x-requested-with': 'XMLHttpRequest'
            }
          }
        );
      }
      if (fetchType === 'json') {
        return axios.post(url, JSON.stringify(cloneData),
          {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'x-requested-with': 'XMLHttpRequest'
            }
          }
        );
      }

      return axios.post(url, qs.stringify(cloneData, {
        indices: false
      }));
    case 'login':
      return axios.post(
        url,
        qs.stringify(cloneData, { indices: false }),
        {
          headers: {
            'x-requested-with': 'XMLHttpRequest'
          }
        }
      );
    case 'put':
      return axios.put(url, qs.stringify(cloneData));
    case 'patch':
      return axios.patch(url, cloneData);
    default:
      return axios(options);
  }
};

const getResponeseErrMsg = (status) => {
  let msg = '未知错误';
  if (status > 199 && status < 300) {
    return '';
  }
  switch (status) {
    case 500:
      msg = '服务器发生未知错误.';
      break;
    case 401:
      msg = '认证失败，请重新登录。';
      break;
    case 302:
      msg = '登录超时，请重新登录。';
      break;
    case 403:
      msg = '访问服务器被拒绝';
      break;
    case 404:
      msg = '未找到请求的页面';
      break;
    case 405:
      msg = '不允许访问本页面的当前方法';
      break;
    case 408:
    case -1:
      msg = '访问超时';
      break;
    case 502:
      msg = '无法连接';
      break;
    case 504:
    case 0:
    case undefined:
      msg = '连接超时，不能连接到服务器。';
      break;
    default:
      msg = `系统错误,错误代码:${status}`;
  }
  return msg;
};

// axios.interceptors.request.use(function (config) {
//   console.log(config);
//   return config;
// }, function (error) {
//   // 对请求错误做些什么
//   return Promise.reject(error);
// });
const ssoInvalid = (string) => { // 返回html判断为登录失效
  if (typeof (string) === 'string') {
    return string.indexOf('<!DOCTYPE html>') !== -1 && string.indexOf('校园信息门户') === -1;
  }
};
axios.interceptors.response.use((response) => {
  const { data } = response;

  if (ssoInvalid(data)) { // html判断为登录失效 返回错误
    return Promise.reject({
      response: {
        ...response,
        status: 302
      }
    });
  }
  return response;
}, (error) => {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default function request (options) {
  return fetch(options)
    .then((response) => {
      const { statusText, status } = response;
      let data = response.data;
      if (options.fetchType === 'blob') {
        return Promise.resolve({
          success: true,
          message: statusText,
          statusCode: status,
          data: window.URL.createObjectURL(data)
        });
      }
      typeof (data) === 'string' && (data = doDecode(data));
      return Promise.resolve({
        success: true,
        message: statusText,
        statusCode: status,
        ...data
      });
    })
    .catch((error) => {
      let msg;
      let statusCode;
      const { response = {} } = error;
      if (response && response instanceof Object) {
        const { data = {}, statusText } = response;
        statusCode = response.status;
        if (statusCode === 401) {
          logoutWith401();
          hashHistory.replace('/login');
          msg = data.message || getResponeseErrMsg(statusCode);
        } else if (statusCode === 302) {
          logoutWith302();
          hashHistory.replace('/login');
          msg = data.message || getResponeseErrMsg(statusCode);
        } else if (statusCode === 555) {
          msg = data.message || getResponeseErrMsg(statusCode);
          window.cnUpholdMsg = data.message || getResponeseErrMsg(statusCode);
          hashHistory.push({
            pathname: '/building'
          });
          return Promise.reject({ success: false, statusCode, message: msg });
        } else if (!statusCode) {
          // logoutWith401();
          // hashHistory.replace('/login');
          msg = data.message || getResponeseErrMsg(statusCode) || statusText;
        } else {
          msg = data.message || getResponeseErrMsg(statusCode) || statusText;
        }
      }
      // hashHistory.push(`/error`)
      if (options.serverError === true) {
        return { success: false, statusCode, message: msg };
      }
      return Promise.reject({ success: false, statusCode, message: msg });
    });
}
