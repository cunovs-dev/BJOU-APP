import { request, config } from 'utils';

const { api } = config;
const { Login, Authentication, PortalLogin, GetPortalToken, SendPhoneLoginCode, GetLoginTips, GetCaptchaImg, GetLastIdentity, SetLastIdentity,SsoPCLogin,SsogetPcPassword } = api;

export async function login (data, serverError = false) {
  return request({
    url: Login,
    method: 'post',
    data,
    serverError,
    hasToken: false
  });
}

export async function queryPcPassword (payload) {
  return request({
    url: SsogetPcPassword,
    data: payload,
    hasToken: false
  });
}

export async function pcLogin (data) {
  return request({
    url: SsoPCLogin,
    method: 'post',
    data,
    hasToken: false
  });
}

export async function authentication (data, serverError = false) {
  return request({
    url: Authentication,
    method: 'post',
    data,
    serverError,
    hasToken: false
  });
}

export async function portalLogin (data, serverError = false) {
  return request({
    url: PortalLogin,
    method: 'login',
    data,
    serverError,
    hasToken: false
  });
}


export async function queryPortalToken (payload) {
  return request({
    url: GetPortalToken,
    data: payload,
    hasToken: false
  });
}

export async function sendPhoneLoginCode (payload) {
  return request({
    url: SendPhoneLoginCode,
    data: payload,
    hasToken: false
  });
}

export async function queryLoginTips (payload) {
  return request({
    url: GetLoginTips,
    data: payload,
    hasToken: false
  });
}

export async function queryCaptchaImg (payload) {
  return request({
    url: GetCaptchaImg,
    data: payload,
    hasToken: false,
    fetchType: 'blob'
  });
}

export async function queryLastIdentity (payload) {
  return request({
    url: GetLastIdentity,
    data: payload,
    hasToken: false
  });
}

export async function setLastIdentity (payload) {
  return request({
    url: SetLastIdentity,
    method: 'post',
    payload,
    hasToken: false
  });
}
