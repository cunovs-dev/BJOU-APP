import { request, config, formsubmit } from 'utils';

const { api } = config;
const { SetAvatar, SetBKPortalAvatar, SetGKPortalAvatar, UpdateInfo, GetResetTypes, SendCode, SendCodeWithToken, VerifyCode, UpdatePhoneOrEmail, ResetPassword, GetPasswordRule, GetAccount } = api;

export async function setAvatar (payload) {
  return request({
    url: SetAvatar,
    method: 'post',
    data: payload
  });
}

export async function setBKPortalAvatar (payload) {
  return request({
    url: SetBKPortalAvatar,
    data: payload,
    hasToken: false,
    method: 'put',
    fetchType: 'portal'
  });
}

export async function setGKPortalAvatar (payload) {
  return request({
    url: SetGKPortalAvatar,
    data: payload,
    hasToken: false,
    method: 'put'
  });
}

export async function updateInfo (payload) {
  return request({
    url: UpdateInfo,
    method: 'post',
    data: payload,
    hasToken: false
  });
}

export async function queryResetTypes (payload) {
  return request({
    url: GetResetTypes,
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}

export async function sendCode (payload) {
  return request({
    url: SendCode,
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}


export async function sendCodeWithToken (payload) {
  return request({
    url: SendCodeWithToken,
    data: payload,
    hasToken: false
  });
}

export async function verifyCode (payload) {
  return request({
    url: VerifyCode,
    data: payload,
    hasToken: false
  });
}

export async function updatePhoneOrEmail (payload) {
  return request({
    url: UpdatePhoneOrEmail,
    data: payload,
    hasToken: false
  });
}

export async function resetPassword (payload) {
  return request({
    url: ResetPassword,
    data: payload,
    hasToken: false
  });
}

export async function queryPasswordRule (payload) {
  return request({
    url: GetPasswordRule,
    data: payload,
    hasToken: false
  });
}

export async function queryAccount (payload) {
  return request({
    url: GetAccount,
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}
