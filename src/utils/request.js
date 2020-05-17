import { hashHistory } from 'react-router';
import axios from 'axios';
import qs from 'qs';
import lodash from 'lodash';
import pathToRegexp from 'path-to-regexp';
import { Toast } from 'antd-mobile';
import { _cg, _cr } from './cookie';
import { baseURL, userTag } from './config';

const { username, usertoken, userpower, userid, useravatar, userloginname, portalUserId, orgCode, portalUserName, doubleTake, portalHeadImg, portalToken } = userTag,
  logoutWith401 = () => {
    _cr(username);
    _cr(userpower);
    _cr(usertoken);
    _cr(userid);
    _cr(useravatar);
    cnDeleteAlias(_cg(userloginname), _cg(usertoken));
  },
  logoutWith302 = () => {
    _cr(portalUserId);
    _cr(orgCode);
    _cr(portalUserName);
    _cr(doubleTake);
    _cr(portalHeadImg);
    _cr(portalToken);
  };
axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true; // 设置不带cookie 不然存在跨域问题
const doDecode = (json) => {
  return eval(`(${json})`);
};
const fetch = (options) => {
  let {
    method = 'get',
    data,
    fetchType = '',
    url,
    hasToken = true
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
    // axios.defaults.withCredentials = false; // 设置不带cookie 不然存在跨域问题
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
      return axios.get(url, {
        params: cloneData
      });
    case 'delete':
      return axios.delete(url, {
        data: cloneData
      });
    case 'post':
      if (fetchType === 'portal') {
        return axios.post(url,qs.stringify(cloneData, {
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
      msg = '网络已断开,不能连接到服务器';
      break;
    default:
      msg = `系统错误,错误代码:${status}`;
  }
  return msg;
};

export default function request (options) {
  return fetch(options)
    .then((response) => {
      const { statusText, status } = response;
      let data = response.data;
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
          window.cnUpholdMsg = data.message || getResponeseErrMsg(statusCode);
          hashHistory.push({
            pathname: '/building'
          });
          return;
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
