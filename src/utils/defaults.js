const defaultTabBars = [{
  title: '首页',
  key: 1,
  icon: require('themes/images/ntabr/home.png'),
  selectedIcon: require('themes/images/ntabr/home-o.png'),
  route: '/',
  iconName: 'homeIcon'
}, {
  title: '在开课程',
  key: 2,
  icon: require('themes/images/ntabr/openning.png'),
  selectedIcon: require('themes/images/ntabr/openning-o.png'),
  route: '/opening',
  iconName: 'openningIcon'
}, {
  title: '已开课程',
  key: 3,
  icon: require('themes/images/ntabr/end.png'),
  selectedIcon: require('themes/images/ntabr/end-o.png'),
  route: '/closed',
  iconName: 'endIcon'
}, {
  title: '我的',
  key: 4,
  icon: require('themes/images/ntabr/mine.png'),
  selectedIcon: require('themes/images/ntabr/mine-o.png'),
  route: '/oldMine',
  iconName: 'mineIcon'
}
];

const bkTabBars = [{
  title: '首页',
  key: 1,
  icon: require('themes/images/ntabr/home.png'),
  selectedIcon: require('themes/images/ntabr/home-o.png'),
  route: '/',
  iconName: 'homeIcon'
}, {
  title: '课程',
  key: 2,
  icon: require('themes/images/ntabr/lesson.png'),
  selectedIcon: require('themes/images/ntabr/lesson-o.png'),
  route: '/lessons',
  iconName: 'openningIcon'
}, {
  title: '通知·制度',
  key: 3,
  icon: require('themes/images/ntabr/notice.png'),
  selectedIcon: require('themes/images/ntabr/notice-o.png'),
  route: '/system',
  iconName: 'endIcon'
}, {
  title: '设置',
  key: 4,
  icon: require('themes/images/ntabr/setup.png'),
  selectedIcon: require('themes/images/ntabr/setup-o.png'),
  route: '/set',
  iconName: 'mineIcon'
}
];

const gkTabBars = [{
  title: '首页',
  key: 1,
  icon: require('themes/images/ntabr/home.png'),
  selectedIcon: require('themes/images/ntabr/home-o.png'),
  route: '/',
  iconName: 'homeIcon'
}, {
  title: '通知',
  key: 2,
  icon: require('themes/images/ntabr/notice.png'),
  selectedIcon: require('themes/images/ntabr/notice-o.png'),
  route: '/systemGK',
  iconName: 'endIcon'
}, {
  title: '设置',
  key: 3,
  icon: require('themes/images/ntabr/setup.png'),
  selectedIcon: require('themes/images/ntabr/setup-o.png'),
  route: '/set',
  iconName: 'mineIcon'
}
];

const resource = {
  resource: '文件',
  label: '标签',
  url: '网页地址',
  page: '网页',
  forumng: '北开讨论区',
  forum: '讨论区',
  quiz: '测验',
  assign: '作业',
  svp: 'SVP学伴视频',
  feedback: '反馈',
  superclassplayer: '超级播放系统',
  bjoupage: '互动网页',
  folder: '文件夹',
  scorm: 'SCORM课件',
  ouwiki: 'OU维基',
  book: '图书',
  mindmap: '思维导图',
  data: '数据库',
  choice: '投票',
  lesson: '程序教学',
  chat: '聊天',
  wiki: 'Wiki协作',
  glossary: '词汇表',
  survey: '调查问卷',
  workshop: '互动评价',
  lti: '外部工具'
};

const masterGrids = [
  {
    icon: require('themes/images/grids/appeal.png'),
    text: '学生反馈',
    path: 'appeallist',
    badge: true
  },
  {
    icon: require('themes/images/grids/review.png'),
    text: '辅导教师评阅',
    path: 'review'
  },
  {
    icon: require('themes/images/grids/replies.png'),
    text: '辅导教师回帖',
    path: 'replies'
  },
  {
    icon: require('themes/images/grids/coach.png'),
    text: '辅导情况',
    path: 'coach'
  },
  {
    icon: require('themes/images/grids/member.png'),
    text: '成员',
    path: 'member'
  },
  {
    icon: require('themes/images/grids/achievement.png'),
    text: '成绩',
    path: 'memberAchievement'
  },
  {
    icon: require('themes/images/grids/finalReport.png'),
    text: '结课报告',
    path: 'finalReport'
  },
  {
    icon: require('themes/images/grids/attendanceReport.png'),
    text: '考勤周报',
    path: 'attendanceReport'
  },
  {
    icon: require('themes/images/grids/attendanceStatistics.png'),
    text: '考勤统计',
    path: 'attendanceStatistics'
  }
];

const moduleGridsGK = [
  {
    id: '1',
    icon: require('themes/images/grids/studentStatusGK.png'),
    text: '学籍信息',
    path: 'studentStatusGK'
  },
  {
    id: '2',
    icon: require('themes/images/grids/examinationGK.png'),
    text: '考试成绩',
    path: 'examinationGK'
  },
  {
    id: '3',
    icon: require('themes/images/grids/courseGK.png'),
    text: '已选课程',
    path: 'courseGK'
  },
  {
    id: '4',
    icon: require('themes/images/grids/schoolCalendarGK.png'),
    text: '历年试题',
    path: 'schoolCalendarList',
    queryType: 'gklnst'
  },
  {
    id: '5',
    icon: require('themes/images/grids/archivesGK.png'),
    text: '常见问题',
    path: 'schoolCalendarList',
    queryType: 'gkcjwt'
  }
];

const allModule = [
  {
    id: '1',
    icon: require('themes/images/grids/progress.png'),
    text: '学业进度',
    // path: 'progressList'
    path: 'alert' // 临时弹窗
  },
  {
    id: '2',
    icon: require('themes/images/grids/timetable.png'),
    text: '课程表',
    path: 'timetable'
  },
  {
    id: '3',
    icon: require('themes/images/grids/graduationInformation.png'),
    text: '毕业信息',
    // path: 'graduationInformation'
    path: 'alert' // 临时弹窗
  },
  {
    id: '4',
    icon: require('themes/images/grids/schoolCalendar.png'),
    text: '校历',
    path: 'schoolCalendar',
    queryType: 'bkxl'
  },
  {
    id: '5',
    icon: require('../themes/images/grids/achievement.png'),
    text: '我的成绩',
    path: 'achievement'
  },
  {
    id: '6',
    icon: require('themes/images/grids/collection.png'),
    text: '我的收藏',
    path: 'collection'
  },

  {
    id: '7',
    icon: require('themes/images/grids/apply.png'),
    text: '我的申请',
    path: 'apply'
  },
  {
    id: '8',
    icon: require('../themes/images/grids/group.png'),
    text: '我的小组',
    path: 'group'
  },
  {
    id: '9',
    icon: require('../themes/images/grids/teachers.png'),
    text: '我的老师',
    path: 'teachers'
  },

  {
    id: '10',
    icon: require('../themes/images/grids/attendance.png'),
    text: '我的考勤',
    path: 'attendance'
  },
  {
    id: '11',
    icon: require('../themes/images/grids/contacts.png'),
    text: '联系人',
    path: 'contacts'
  },
  {
    id: '12',
    icon: require('../themes/images/grids/pay.png'),
    text: '缴费系统',
    path: 'payment'
  },
  // {
  //   id: '13',
  //   icon: require('../themes/images/others/attendance.jpg'),
  //   text: '选课信息',
  //   appType: 'xkxx',
  //   path: 'oauth'
  // },
  // {
  //   id: '14',
  //   icon: require('../themes/images/others/attendance.jpg'),
  //   text: '学分银行',
  //   path: 'oauth'
  // }

];
export default { bkTabBars, gkTabBars, resource, masterGrids, moduleGridsGK, allModule, defaultTabBars };
