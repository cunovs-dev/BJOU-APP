import { request, config } from 'utils';

const { api: { GetCurrentTask, GetAllTask } } = config;

export async function queryCurrentTask (payload) {
  return request({
    url: GetCurrentTask,
    data: payload,
  });
}

export async function queryAllTask (payload) {
  return request({
    url: GetAllTask,
    method: 'get',
    data: payload,
  });
}

