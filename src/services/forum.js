import { request, config } from 'utils';

const { api: { GetForum, AddNewForum, GetForumReply, UploadFiles, ReplyForum } } = config;

export async function queryForum (payload) {
  return request({
    url: GetForum,
    method: 'get',
    data: payload,
  });
}

export async function queryReply (payload) {
  return request({
    url: GetForumReply,
    method: 'get',
    data: payload,
  });
}

export async function addNewForum (payload) {
  return request({
    url: AddNewForum,
    method: 'post',
    data: payload,
  });
}

export async function replyForum (payload) {
  return request({
    url: ReplyForum,
    method: 'post',
    data: payload,
  });
}


export async function UploadFile (payload) {
  return request({
    url: UploadFiles(),
    method: 'post',
    data: payload,
    hasToken: false
  });
}
