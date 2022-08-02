import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'dva/router';
import App from 'routes/app';
import Login from 'routes/login/Login';
import { bkIdentity, oldAPP } from 'utils';

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model);
  }
};

const Routers = function ({ history, app }) {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        if (oldAPP()) {
          require.ensure([], (require) => {
            registerModel(app, require('models/oldDashboard'));
            registerModel(app, require('models/lessondetails'));
            cb(null, { component: require('routes/oldDashboard/') });
          }, 'oldDashboard');
        } else if (bkIdentity()) {
          require.ensure([], (require) => {
            registerModel(app, require('models/dashboard'));
            registerModel(app, require('models/lessondetails'));
            cb(null, { component: require('routes/dashboard/') });
          }, 'dashboard');
        } else {
          require.ensure([], (require) => {
            registerModel(app, require('models/dashboardGK'));
            cb(null, { component: require('routes/dashboardGK/') });
          }, 'dashboardGK');
        }
      },
      childRoutes: [
        {
          path: 'dashboard',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/dashboard'));
              registerModel(app, require('models/lessondetails'));
              cb(null, require('routes/dashboard/'));
            }, 'dashboard');
          }
        },
        {
          path: 'dashboardGK',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/dashboardGK'));
              cb(null, require('routes/dashboardGK/'));
            }, 'dashboardGK');
          }
        },
        {
          path: 'oldDashboard',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/oldDashboard'));
              registerModel(app, require('models/lessondetails'));
              cb(null, require('routes/oldDashboard/'));
            }, 'oldDashboard');
          }
        },
        {
          path: 'lessons',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/lessons'));
              cb(null, require('routes/lessons/'));
            }, 'lessons');
          }
        },
        {
          path: 'login',
          component: Login,
          getIndexRoute (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/login'));
              cb(null, { component: require('routes/login/accountLogin') });
            }, 'login');
          },
          childRoutes: [
            {
              path: '/login/accountLogin',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('models/login'));
                  cb(null, require('routes/login/accountLogin'));
                }, 'login');
              }
            },
            // {
            //   path: '/login/phoneLogin',
            //   getComponent (nextState, cb) {
            //     require.ensure([], (require) => {
            //       registerModel(app, require('models/login'));
            //       cb(null, require('routes/login/phoneLogin'));
            //     }, 'login');
            //   }
            // }
            {
              path: '/login/oldLogin',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('models/oldLogin'));
                  cb(null, require('routes/login/oldLogin'));
                }, 'oldLogin');
              }
            }
          ]
        },
        {
          path: 'resetPassword',
          component: Login,
          getIndexRoute (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/resetPassword'));
              cb(null, { component: require('routes/resetPassword/queryUser') });
            }, 'resetPassword');
          },
          childRoutes: [
            {
              path: '/resetPassword/checkInfo',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('models/resetPassword'));
                  cb(null, require('routes/resetPassword/queryUser'));
                }, 'resetPassword');
              }
            },
            {
              path: '/resetPassword/phoneReset',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('models/resetPassword'));
                  cb(null, require('routes/resetPassword/phoneReset'));
                }, 'resetPassword');
              }
            },
            {
              path: '/resetPassword/mailReset',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('models/resetPassword'));
                  cb(null, require('routes/resetPassword/mailReset'));
                }, 'resetPassword');
              }
            },
            {
              path: '/resetPassword/setPassword',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('models/resetPassword'));
                  cb(null, require('routes/resetPassword/setPassword'));
                }, 'resetPassword');
              }
            },
            {
              path: '/resetPassword/successPage',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('models/resetPassword'));
                  cb(null, require('routes/resetPassword/successPage'));
                }, 'resetPassword');
              }
            }
          ]
        },
        {
          path: 'firstLogin',
          component: Login,
          getIndexRoute (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/firstLogin'));
              cb(null, { component: require('routes/firstLogin/checkInfo') });
            }, 'firstLogin');
          },
          childRoutes: [
            {
              path: '/firstLogin/checkInfo',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('models/firstLogin'));
                  cb(null, require('routes/firstLogin/checkInfo'));
                }, 'firstLogin');
              }
            },
            {
              path: '/firstLogin/phoneReset',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('models/firstLogin'));
                  cb(null, require('routes/firstLogin/phoneReset'));
                }, 'firstLogin');
              }
            },
            {
              path: '/firstLogin/mailReset',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('models/firstLogin'));
                  cb(null, require('routes/firstLogin/mailReset'));
                }, 'firstLogin');
              }
            },
            {
              path: '/firstLogin/setPassword',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('models/firstLogin'));
                  cb(null, require('routes/firstLogin/setPassword'));
                }, 'firstLogin');
              }
            }
          ]
        },
        {
          path: 'mine',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/mine'));
              cb(null, require('routes/mine/'));
            }, 'mine');
          }
        },
        {
          path: 'oldMine',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/oldMine'));
              cb(null, require('routes/oldMine/'));
            }, 'oldMine');
          }
        },
        {
          path: 'iframe',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('routes/iframe/'));
            }, 'iframe');
          }
        },
        {
          path: 'setup',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/setup'));
              cb(null, require('routes/setup/'));
            }, 'setup');
          }
        },
        {
          path: 'oldSetup',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/oldSetup'));
              cb(null, require('routes/oldSetup/'));
            }, 'oldSetup');
          }
        },
        {
          path: 'opinion',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/opinion'));
              cb(null, require('routes/opinion/'));
            }, 'opinion');
          }
        },
        {
          path: 'myopinion',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/myopinion'));
              cb(null, require('routes/myopinion/'));
            }, 'myopinion');
          }
        },
        {
          path: 'opiniondetails',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/opiniondetails'));
              cb(null, require('routes/opiniondetails/'));
            }, 'opiniondetails');
          }
        },
        {
          path: 'building',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/building'));
              cb(null, require('routes/building/'));
            }, 'building');
          }
        },
        {
          path: 'lessondetails',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/lessondetails'));
              cb(null, require('routes/lessondetails/'));
            }, 'lessondetails');
          }
        },
        {
          path: 'superclass',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/superClass'));
              cb(null, require('routes/superClass/'));
            }, 'superclass');
          }
        },
        {
          path: 'homework',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/homework'));
              cb(null, require('routes/homework/'));
            }, 'homework');
          }
        },
        {
          path: 'homeworkadd',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/homeworkadd'));
              cb(null, require('routes/homeworkadd/'));
            }, 'homeworkadd');
          }
        },
        {
          path: 'homepage',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/homepage'));
              cb(null, require('routes/homepage/'));
            }, 'homepage');
          }
        },
        {
          path: 'oldHomePage',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/oldHomePage'));
              cb(null, require('routes/oldHomePage/'));
            }, 'oldHomePage');
          }
        },
        {
          path: 'contacts',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/contacts'));
              cb(null, require('routes/contacts/'));
            }, 'contacts');
          }
        },
        {
          path: 'messageCenter',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/messageCenter'));
              cb(null, require('routes/messageCenter/'));
            }, 'messageCenter');
          }
        },
        {
          path: 'medalList',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/medalList'));
              cb(null, require('routes/medalList/'));
            }, 'medalList');
          }
        },
        {
          path: 'medal',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/medal'));
              cb(null, require('routes/medal/'));
            }, 'medal');
          }
        },
        {
          path: 'achievement',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/achievement'));
              cb(null, require('routes/achievement/'));
            }, 'achievement');
          }
        },
        {
          path: 'achievementdetails',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/achievementdetails'));
              cb(null, require('routes/achievementdetails/'));
            }, 'achievementdetails');
          }
        },
        {
          path: 'teachers',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/teachers'));
              cb(null, require('routes/teachers/'));
            }, 'teachers');
          }
        },
        {
          path: 'group',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/group'));
              cb(null, require('routes/group/'));
            }, 'group');
          }
        },
        {
          path: 'groupdetails',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/groupdetails'));
              cb(null, require('routes/groupdetails/'));
            }, 'groupdetails');
          }
        },
        {
          path: 'attendance',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/attendance'));
              cb(null, require('routes/attendance/'));
            }, 'attendance');
          }
        },
        {
          path: 'attendancedetails',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/attendancedetails'));
              cb(null, require('routes/attendancedetails/'));
            }, 'attendancedetails');
          }
        },
        {
          path: 'forum',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/forum'));
              cb(null, require('routes/forum/'));
            }, 'forum');
          }
        },
        {
          path: 'forumDetails',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/forumDetails'));
              cb(null, require('routes/forumDetails/'));
            }, 'forumDetails');
          }
        },
        {
          path: 'sendForum',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/sendForum'));
              cb(null, require('routes/sendForum/'));
            }, 'sendForum');
          }
        },
        {
          path: 'replyAll',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/replyAll'));
              cb(null, require('routes/replyAll/'));
            }, 'replyAll');
          }
        },
        {
          path: 'userpage',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/userpage'));
              cb(null, require('routes/userpage/'));
            }, 'userpage');
          }
        },
        {
          path: 'conversation',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/conversation'));
              cb(null, require('routes/conversation/'));
            }, 'conversation');
          }
        },
        {
          path: 'page',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/page'));
              cb(null, require('routes/page/'));
            }, 'page');
          }
        },
        {
          path: 'quiz',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/quiz'));
              cb(null, require('routes/quiz/'));
            }, 'quiz');
          }
        },
        {
          path: 'quizDetails',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/quizDetails'));
              cb(null, require('routes/quizDetails/'));
            }, 'quizDetails');
          }
        },
        {
          path: 'quizReview',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/quizReview'));
              cb(null, require('routes/quizReview/'));
            }, 'quizReview');
          }
        },
        {
          path: 'quizComplete',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/quizComplete'));
              cb(null, require('routes/quizComplete/'));
            }, 'quizComplete');
          }
        },
        {
          path: 'details',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/details'));
              cb(null, require('routes/details/'));
            }, 'details');
          }
        },
        {
          path: 'url',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/url'));
              cb(null, require('routes/url/'));
            }, 'url');
          }
        },
        {
          path: 'feedback',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/feedback'));
              cb(null, require('routes/feedback/'));
            }, 'feedback');
          }
        },
        {
          path: 'feedbackdetails',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/feedbackdetails'));
              cb(null, require('routes/feedbackdetails/'));
            }, 'feedbackdetails');
          }
        },
        {
          path: 'feedbackresult',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/feedbackresult'));
              cb(null, require('routes/feedbackresult/'));
            }, 'feedbackresult');
          }
        },
        {
          path: 'feedbackresultdetails',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/feedbackresult'));
              cb(null, require('routes/feedbackresultdetails/'));
            }, 'feedbackresultdetails');
          }
        },
        {
          path: 'test',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('routes/test/'));
            }, 'test');
          }
        },
        {
          path: 'set',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/mine'));
              cb(null, require('routes/set/'));
            }, 'set');
          }
        },
        {
          path: 'oldSet',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/mine'));
              cb(null, require('routes/oldSet/'));
            }, 'oldSet');
          }
        },
        {
          path: 'choice',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/choice'));
              cb(null, require('routes/choice/'));
            }, 'choice');
          }
        },
        {
          path: 'folder',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/folder'));
              cb(null, require('routes/folder/'));
            }, 'folder');
          }
        },
        {
          path: 'appeallist',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/appeallist'));
              cb(null, require('routes/appeallist/'));
            }, 'appeallist');
          }
        },
        {
          path: 'appealdetails',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/appealdetails'));
              cb(null, require('routes/appealdetails/'));
            }, 'appealdetails');
          }
        },
        {
          path: 'coach',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/coach'));
              cb(null, require('routes/coach/'));
            }, 'coach');
          }
        },
        {
          path: 'finalReport',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/finalReport'));
              cb(null, require('routes/finalReport/'));
            }, 'finalReport');
          }
        },
        {
          path: 'review',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/review'));
              cb(null, require('routes/review/'));
            }, 'review');
          }
        },
        {
          path: 'reviewDetails',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/reviewDetails'));
              cb(null, require('routes/reviewDetails/'));
            }, 'reviewDetails');
          }
        },
        {
          path: 'member',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/member'));
              cb(null, require('routes/member/'));
            }, 'member');
          }
        },
        {
          path: 'memberAchievement',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/memberAchievement'));
              cb(null, require('routes/memberAchievement/'));
            }, 'memberAchievement');
          }
        },
        {
          path: 'memberAchievementDetails',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/memberAchievementDetails'));
              cb(null, require('routes/memberAchievementDetails/'));
            }, 'memberAchievementDetails');
          }
        },
        {
          path: 'attendanceReport',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/attendanceReport'));
              cb(null, require('routes/attendanceReport/'));
            }, 'attendanceReport');
          }
        },
        {
          path: 'attendanceStatistics',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/attendanceStatistics'));
              cb(null, require('routes/attendanceStatistics/'));
            }, 'attendanceStatistics');
          }
        },
        {
          path: 'replies',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/replies'));
              cb(null, require('routes/replies/'));
            }, 'replies');
          }
        },
        {
          path: 'system',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/system'));
              cb(null, require('routes/system/'));
            }, 'system');
          }
        },
        {
          path: 'systemGK',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/systemGK'));
              cb(null, require('routes/systemGK/'));
            }, 'systemGK');
          }
        },
        {
          path: 'systemDetails',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/systemDetails'));
              cb(null, require('routes/systemDetails/'));
            }, 'systemDetails');
          }
        },
        {
          path: 'progressList',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/progressList'));
              cb(null, require('routes/progressList/'));
            }, 'progressList');
          }
        },
        {
          path: 'progressDetails',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('routes/progressDetails/'));
            }, 'progressDetails');
          }
        },
        {
          path: 'timetable',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/timetable'));
              cb(null, require('routes/timetable/'));
            }, 'timetable');
          }
        },
        {
          path: 'apply',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/apply'));
              cb(null, require('routes/apply/'));
            }, 'apply');
          }
        },
        {
          path: 'collection',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/collection'));
              cb(null, require('routes/collection/'));
            }, 'collection');
          }
        },
        {
          path: 'schoolCalendarList',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/schoolCalendarList'));
              cb(null, require('routes/schoolCalendarList/'));
            }, 'schoolCalendarList');
          }
        },
        {
          path: 'schoolCalendar',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/schoolCalendar'));
              cb(null, require('routes/schoolCalendar/'));
            }, 'schoolCalendar');
          }
        },
        {
          path: 'graduationInformation',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/graduationInformation'));
              cb(null, require('routes/graduationInformation/'));
            }, 'graduationInformation');
          }
        },
        {
          path: 'examinationGK',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/examinationGK'));
              cb(null, require('routes/examinationGK/'));
            }, 'examinationGK');
          }
        },
        {
          path: 'modelManage',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/modelManage'));
              cb(null, require('routes/modelManage/'));
            }, 'modelManage');
          }
        },
        {
          path: 'verification',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/verification'));
              cb(null, require('routes/verification/'));
            }, 'verification');
          }
        },
        {
          path: 'setPhoneOrMail',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/setPhoneOrMail'));
              cb(null, require('routes/setPhoneOrMail/'));
            }, 'setPhoneOrMail');
          }
        },
        {
          path: 'setPassword',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/setPassword'));
              cb(null, require('routes/setPassword/'));
            }, 'setPassword');
          }
        },
        {
          path: 'courseGK',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/courseGK'));
              cb(null, require('routes/courseGK/'));
            }, 'courseGK');
          }
        },
        {
          path: 'courseDetailsGK',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/courseGK'));
              cb(null, require('routes/courseDetailsGK/'));
            }, 'courseDetailsGK');
          }
        },
        {
          path: 'studentStatusGK',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/studentStatusGK'));
              cb(null, require('routes/studentStatusGK/'));
            }, 'studentStatusGK');
          }
        },
        {
          path: 'courseware',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/courseware'));
              cb(null, require('routes/courseware/'));
            }, 'courseware');
          }
        },
        {
          path: 'closed',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/closed'));
              cb(null, require('routes/closed/'));
            }, 'closed');
          },
        },
        {
          path: 'opening',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/opening'));
              cb(null, require('routes/opening/'));
            }, 'opening');
          },
        },
        {
          path: 'payment',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/payment'));
              cb(null, require('routes/payment/'));
            }, 'payment');
          },
        },
        {
          path: 'oauth',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/oauth'));
              cb(null, require('routes/oauth/'));
            }, 'oauth');
          },
        },
        {
          path: '*',
          getComponent (nextState, cb) {
            const { location: { pathname } } = nextState;
            if (pathname && /^\/(android).+?index\.html$/.exec(pathname)) {
              require.ensure([], (require) => {
                registerModel(app, require('models/dashboard'));
                cb(null, require('routes/dashboard/'));
              });
            }
          }
        }
      ]
    }
  ];

  return (
    <Router history={history} routes={routes} />
  );
};

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object
};

export default Routers;
