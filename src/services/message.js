import { request, config } from 'utils';

const { api: { GetMessageCount, GetMessage, GetTalkMessage, GetConversation, SendConversation, ReadMessage, ReadNotice, GetSysNotice } } = config;

export async function queryMessageCount (payload) {
  return request({
    url: GetMessageCount,
    method: 'get',
    data: payload,
  });
}

export async function queryMessage (payload) {
  return request({
    url: GetMessage,
    method: 'get',
    data: payload,
  });
}

export async function queryTalkMessage (payload) {
  return request({
    url: GetTalkMessage,
    method: 'get',
    data: payload,
  });
}

export async function queryConversation (payload) {
  return request({
    url: GetConversation,
    method: 'get',
    data: payload,
  });
}

export async function sendTalk (payload) {
  return request({
    url: SendConversation,
    method: 'post',
    data: payload,
  });
}

export async function readMessage (payload) {
  return request({
    url: ReadMessage,
    method: 'post',
    data: payload,
  });
}

export async function readNotice (payload) {
  return request({
    url: ReadNotice,
    method: 'get',
    data: payload,
  });
}

export async function querySysNotice (payload) {
  return request({
    url: GetSysNotice,
    method: 'get',
    data: payload,
    hasToken: false
  });
}
