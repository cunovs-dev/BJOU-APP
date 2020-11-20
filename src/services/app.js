import { request, config } from 'utils';

const { api: { userLogout, GetBaseInfo, GetUserInfo, GetMoodleUserInfo, GetMedalList, AddContacts, DeleteContacts, GetAttendance, GetAttendanceList, AccessTime, Log, OpinionAdd, SeedOpinionFiles, GetVersion, GetAppealDetail, ReplyAppeal, ReadAppeal, UploadRunningLogsApi, GetSchoolCalendar, GetGraduationInfo, GetMenusApi, sendMenusApi, GetPaymentState, GetStudentInfo, GetPortalUser, Collection, GetInformationGK, EnclosureDownload, GetMoodleToken, CheckFirstLogin, GetPersonal, GetCurrentUser, ChangCode, RefreshAttendance } } = config;


export async function logout () {
  return request({
    url: userLogout,
    method: 'get'
  });
}

export async function queryBaseInfo (data) {
  const { usertoken, userid } = data;
  return request({
    url: `${GetBaseInfo}/${usertoken}/${userid}`,
    method: 'get',
    hasToken: false,
    data
  });
}

export async function queryUserInfo (data) {
  return request({
    url: GetUserInfo,
    method: 'get',
    data,
    hasToken: false,
    fetchType: 'portal'
  });
}


export async function queryPersonal (data) {
  return request({
    url: GetPersonal,
    method: 'get',
    data
  });
}

export async function queryMoodleUserInfo (data) {
  return request({
    url: GetMoodleUserInfo,
    method: 'get',
    data
  });
}

export async function queryMedalList (data) {
  return request({
    url: GetMedalList,
    method: 'get',
    data
  });
}


export async function AddContact (data) {
  return request({
    url: AddContacts,
    method: 'post',
    data
  });
}

export async function DeleteContact (data) {
  return request({
    url: DeleteContacts,
    method: 'post',
    data
  });
}

export async function getAttendance (data) {
  return request({
    url: GetAttendance,
    method: 'get',
    data
  });
}

export async function getAttendanceList (data) {
  return request({
    url: GetAttendanceList,
    method: 'get',
    data
  });
}

export async function accessTime (data) {
  return request({
    url: AccessTime,
    method: 'post',
    data,
    hasToken: false
  });
}

export async function logApi (data) {
  return request({
    url: Log,
    method: 'post',
    data,
    hasToken: false
  });
}

export async function sendOpinion (payload) {
  return request({
    url: OpinionAdd,
    method: 'post',
    data: payload,
    hasToken: false
  });
}

export async function sendOpinionFiles (payload) {
  return request({
    url: SeedOpinionFiles(),
    method: 'post',
    data: payload,
    hasToken: false
  });
}

export async function getVersion (payload) {
  return request({
    url: GetVersion,
    data: payload,
    hasToken: false
  });
}

export async function replyAppeal (payload) {
  return request({
    url: ReplyAppeal,
    method: 'post',
    data: payload,
    hasToken: false
  });
}

export async function queryAppealDetail (payload) {
  return request({
    url: GetAppealDetail,
    method: 'get',
    data: payload,
    hasToken: false
  });
}

export async function readAppeal (payload) {
  return request({
    url: ReadAppeal,
    method: 'get',
    data: payload,
    hasToken: false
  });
}

export async function uploadRunningLogs (payload) {
  return request({
    url: UploadRunningLogsApi,
    method: 'post',
    data: payload,
    hasToken: false
  });
}

export async function querySchoolCalendar (payload) {
  return request({
    url: GetSchoolCalendar,
    method: 'get',
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}


export async function queryInformationGK (payload) {
  return request({
    url: GetInformationGK,
    method: 'get',
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}

export async function queryGraduationInfo (payload) {
  return request({
    url: GetGraduationInfo,
    method: 'get',
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}

export async function queryMenus (payload) {
  const { userId = '' } = payload;
  return request({
    url: `${GetMenusApi}/${userId}`,
    method: 'get',
    hasToken: false
  });
}

export async function sendMenus (payload) {
  return request({
    url: sendMenusApi,
    method: 'post',
    data: payload,
    hasToken: false
  });
}

export async function queryPaymentState (payload) {
  return request({
    url: GetPaymentState,
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}

export async function queryStudentInfo (payload) {
  return request({
    url: GetStudentInfo,
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}

export async function queryPortalUser (payload) {
  return request({
    url: GetPortalUser,
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}

export async function collection (payload) {
  return request({
    url: Collection,
    method: 'post',
    data: payload,
    hasToken: false,
    fetchType: 'json'
  });
}

export async function queryFiles (payload) {
  return request({
    url: EnclosureDownload,
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}

export async function queryMoodleToken (payload) {
  return request({
    url: GetMoodleToken,
    data: payload,
    hasToken: false
  });
}

export async function checkFirstLogin (payload) {
  return request({
    url: CheckFirstLogin,
    data: payload,
    hasToken: false
  });
}

export async function queryCurrentUser (payload) {
  return request({
    url: GetCurrentUser,
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}

export async function changeCode (payload) {
  return request({
    url: ChangCode,
    data: payload,
    hasToken: false,
    fetchType: 'portal'
  });
}

export async function refreshAttendance (data) {
  return request({
    url: RefreshAttendance,
    method: 'get',
    data
  });
}
