module.exports = {
  name: 'BJOU-APP',
  baseURL: `${cnApiServiceUrl}`,
  appId: 'bjouMobile',
  userTag: {
    username: 'username',
    usertoken: 'usertoken',
    userpower: 'userpower',
    userid: 'userid',
    useravatar: 'useravatar',
    userloginname: 'userloginname',
    portalToken: 'portalToken',
    portalUserId: 'portalUserId',
    orgCode: 'orgCode',
    portalUserName: 'portalUserName',
    doubleTake: 'doubleTake',
    userpwd: 'userpwd',
    portalHeadImg: 'portalHeadImg'
  },
  api: {
    Login: '/login',
    userLogout: '/logout',
    GetLessonDetails: '/course',
    GetOpeningLessons: '/courselist/open',
    GetClosedLessons: '/courselist/due',
    GetBaseInfo: '/config',
    GetCurrentTask: '/task',
    GetAllTask: '/task/all',
    GetForum: '/forum',
    GetForumReply: '/forum/comments',
    AddNewForum: '/forum/add',
    ReplyForum: '/forum/postadd',
    UploadFiles: () => cnGetServiceUrl('moodle', '/webservice/upload.php'),
    GetPage: '/page',
    GetMoodleUserInfo: '/personal',
    GetMessageCount: '/msg/counts',
    GetMessage: '/msg/notices',
    GetTalkMessage: '/msg/messageList',
    ReadMessage: '/msg/markallread',
    ReadNotice: '/msg/readNotices',
    GetConversation: '/msg/messages',
    SendConversation: '/msg/sendmessages',
    GetQuiz: '/quiz',
    GetExamination: '/quiz/start',
    GetQuizReview: '/quiz/review',
    GetQuizSummary: '/quiz/summary',
    SendQuiz: '/quiz/process',
    GetLastTimeExamination: '/quiz/page',
    GetHomeworkInfo: '/assignment/getInformation',
    GetHomeWorkComments: '/assignment/getComments',
    GetMedalList: '/badge/user',
    GetGroupList: '/assignment/getTeamMembers',
    GetGradeList: '/grade',
    getTeachersList: '/mentors',
    GetMember: '/group/users',
    GetContacts: '/personal/contacts',
    AddContacts: '/personal/addcontacts',
    DeleteContacts: '/personal/delcontacts',
    ADDHomeWork: '/assignment/add',
    UrlApi: 'url',
    GetFeedBack: '/questionnaire',
    GetFeedBackQuestions: '/questionnaire/getquestion',
    GetSuperClass: '/svp',
    GetResource: '/resource',
    GetFeedBackInfos: '/questionnaire/response',
    SendFeedBack: '/questionnaire/submit',
    CompleteFeedBack: '/questionnaire/unfinished',
    SetAvatar: '/personal/update',
    GetAttendance: '/attendance/course',
    GetAttendanceList: '/attendance/courseList',
    GetGradeCourseList: '/grade/courseList',
    AccessTime: '/log/accesstime',
    Log: '/log',
    UpdateInfo: '/personal/updateInfo',
    SendAssing: '/assignment/commit',
    GetSysNotice: 'notic/list',
    OpinionAdd: 'feedback/add',
    SeedOpinionFiles: () => cnGetServiceUrl('manager', '/file/upload'),
    MyOpinionList: '/feedback',
    ManualCompletion: '/cm/completion',
    GetVersion: '/config/appVersion',
    HelpUrl: () => cnGetServiceUrl('help', '/cnvhelp/index.html'),
    GetChoice: '/vote',
    SendChoice: '/vote/submit',
    GetFolder: '/folder/list',
    GetAppealList: '/feedback/findCourse',
    ReplyAppeal: '/feedback/replay',
    GetAppealCount: '/feedback/getReplyCount',
    GetAppealDetail: 'feedback/get',
    ReadAppeal: '/notic/readNotice',
    UploadRunningLogsApi: '/config/prints',
    GetMenusApi: '/config/module',
    sendMenusApi: '/config/saveModuleConfig',
    GetMoodleToken: '/config/getBkUser',

    // 门户登录

    Authentication: `${portalServiceUrl}/info/sso`,
    PortalLogin: `${portalServiceUrl}/info/login`,
    GetPortalToken: `${portalServiceUrl}/info/oauth/userToken`,
    SendPhoneLoginCode: `${portalSsoServiceUrl}/captcha/sms`,

    // 门户接口
    GetPaymentState: `${portalServiceUrl}/info/mobile/bkuser/getpaymentState`, // 缴费情况
    GetUserInfo: `${portalServiceUrl}/info/mobile/bkuser/get`, // 门户获取个人信息接口
    GetProgressList: `${portalServiceUrl}/info/mobile/bkcourse/academicSchedule`, // 学业进度表
    GetTimetable: `${portalServiceUrl}/info/mobile/bkcourse/list`, // 课程表
    GetApplyList: `${portalServiceUrl}/info/mobile/bkApplyInfo/list`, // 申请信息
    GetSchoolCalendar: `${portalServiceUrl}/info/mobile/information/schoolCalendar`, // 校历
    GetGraduationInfo: `${portalServiceUrl}/info/mobile/graduationInfo/list`, // 毕业信息
    GetCollectionList: `${portalServiceUrl}/info/mobile/informationCollection/list`, // 收藏
    GetNoticeList: `${portalServiceUrl}/info/mobile/information/list`, // 通知制度
    GetNoticeDetails: `${portalServiceUrl}/info/mobile/information/get`, // 通知制度详情
    GetInformationGK: `${portalServiceUrl}/info/mobile/information/informations`, // 国开教学日历
    GetStudentInfo: `${portalServiceUrl}/info/mobile/studentInfo/findStudentInfo`, // 国开学籍信息
    GetExamGK: `${portalServiceUrl}/info/mobile/examscore/list`, // 国开考试成绩
    GetCourseGK: `${portalServiceUrl}/info/mobile/courseInfo/list`, // 国开已选课程
    downFiles: `${portalServiceUrl}/info/mobile/information/stream/zip`, // 文档下载
    EnclosureDownload: `${portalServiceUrl}/info/file/downloadFile`, // 附件下载
    GetPortalUser: `${portalServiceUrl}/info/user/getUser`,
    Collection: `${portalServiceUrl}/info/mobile/informationCollection/update`,
    GetResetTypes: `${portalSsoServiceUrl}/cipherreset/getResetTypes`,
    SendCode: `${portalSsoServiceUrl}/cipherreset/sendCode`,
    PortalFileUpload: `${portalServiceUrl}/info/file/upload`, // 附件上传
    SetBKPortalAvatar: `${portalServiceUrl}/info/mobile/bkuser/updateImg`,
    SetGKPortalAvatar: `${portalServiceUrl}/info/mobile/userInfo/updateImg`,
    VerifyCode: `${portalSsoServiceUrl}/cipherreset/verifyCode`,
    UpdatePhoneOrEmail: `${portalSsoServiceUrl}/wx/portal/updatePhoneOrEmail`,
    ResetPassword: `${portalSsoServiceUrl}/cipherreset/resetPassword`,
    GetPasswordRule: `${portalSsoServiceUrl}/cipherreset/getPasswordRule`,
    SendCodeWithToken: `${portalSsoServiceUrl}/wx/portal/sendCode`,
    GetAccount: `${portalSsoServiceUrl}/cipherreset/getUserByAccountName`
  }
};
