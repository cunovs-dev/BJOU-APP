import { request, config } from 'utils';

const { api: { GetGroupList, GetGradeList, getTeachersList, GetMember, GetContacts, GetGradeCourseList, MyOpinionList, GetAppealList, GetProgressList, GetTimetable, GetApplyList, GetCollectionList, GetNoticeList, GetExamGK, GetCourseGK, GetNoticeDetails } } = config;

export async function queryGroup (payload) {
  return request({
    url: GetGroupList,
    method: 'get',
    data: payload
  });
}

export async function queryGradeDetails (payload) {
  return request({
    url: GetGradeList,
    method: 'get',
    data: payload
  });
}

export async function queryTeachers (payload) {
  return request({
    url: getTeachersList,
    method: 'get',
    data: payload
  });
}

export async function queryMembers (payload) {
  return request({
    url: GetMember,
    method: 'get',
    data: payload
  });
}

export async function queryContacts (payload) {
  return request({
    url: GetContacts,
    method: 'get',
    data: payload
  });
}

export async function queryGradeCourseList (payload) {
  return request({
    url: GetGradeCourseList,
    method: 'get',
    data: payload
  });
}

export async function queryMyOpinionList ({ userid = '' }) {
  return request({
    url: `${MyOpinionList}/${userid}`,
    method: 'get',
    hasToken: false
  });
}

export async function queryAppealList (payload) {
  return request({
    url: GetAppealList,
    method: 'get',
    data: payload,
    hasToken: false
  });
}

export async function queryProgressList (payload) {
  return request({
    url: GetProgressList,
    method: 'get',
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}

export async function queryGetTimetable (payload) {
  return request({
    url: GetTimetable,
    method: 'get',
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}

export async function queryApplyList (payload) {
  return request({
    url: GetApplyList,
    method: 'get',
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}

export async function queryCollectionList (payload) {
  const { currentPage = 1, pageSize = 10 } = payload;
  return request({
    url: `${GetCollectionList}?currentPage=${currentPage}&pageSize=${pageSize}`,
    method: 'get',
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}


export async function queryNoticeList (payload) {
  const { params, page = {} } = payload;
  const { currentPage = 1, pageSize = 10 } = page;
  return request({
    url: `${GetNoticeList}?currentPage=${currentPage}&pageSize=${pageSize}`,
    method: 'post',
    data: params,
    hasToken: false,
    fetchType: 'json' // 数据格式为JSON
  });
}

export async function queryExamList (payload) {
  return request({
    url: GetExamGK,
    method: 'get',
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}

export async function queryNoticeDetails (payload) {
  return request({
    url: GetNoticeDetails,
    method: 'get',
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}

export async function queryCourseGK (payload) {
  return request({
    url: GetCourseGK,
    method: 'get',
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}
