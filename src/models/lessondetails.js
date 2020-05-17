/**
 * @author Lowkey
 * @date 2019/03/15 15:07:41
 * @Description:
 */

import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { Toast } from 'components';
import { handlerCourseClick } from 'utils/commonevents';
import { queryLessonDetails, manualCompletion, queryAppealCount} from 'services/lesson';
import { url, queryResource } from 'services/resource';
import { userTag } from 'utils/config';
import { _cg } from 'utils/cookie';

const { username, userid, userloginname } = userTag,
  findNameByCourses = (course = [], id) => {
    let name = '';
    if (id && course.length) {
      const selectedCourse = course.filter(c => c.id == id);
      name = selectedCourse.length ? (selectedCourse[0] || {}).fullname : '';
    }
    return name || '';
  };

/**
 * 获取section
 * @param arr
 */
const getLessonList = (arr) => {
  return arr.slice(1);
};

/**
 * @param data
 * 修改返回值
 */
const adapter = (data) => {
  data.guide = data.contents[0].modules;
  data.section0Summary = data.contents[0].summary;
  data.resources = getLessonList(data.contents);
  return data;
};

export default modelExtend(model, {
  namespace: 'lessondetails',
  state: {
    data: {},
    refreshing: false,
    selected: 1,
    activityIndex: 0,
    accordionIndex: ['0'],
    courseid: '',
    scrollerTop: 0,
    appealCount: 0
  },
  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen(({ pathname, action, query }) => {
        const { userid, courseid } = query;
        if (pathname === '/lessondetails') {
          if (action === 'PUSH') {
            dispatch({
              type: 'updateState',
              payload: {
                data: [],
                selectIndex: 0,
                scrollerTop: 0,
                refreshing: false,
                activityIndex: 0,
                accordionIndex: ['0'],
                courseid
              },
            });
            dispatch({
              type: 'queryDetails',
              payload: {
                userid,
                courseid,
              },
            });
          } else {
            dispatch({
              type: 'updateDetails',
              payload: {
                userid,
                courseid,
              },
            });
          }
        }
      });
    },
  },
  effects: {
    * queryDetails ({ payload }, { call, put, select }) {
      const { courseData = [] } = yield select(_ => _.app),
        { courseid = '' } = payload,
        coursename = findNameByCourses(courseData, courseid);
      const data = yield call(queryLessonDetails, {
        ...payload,
        coursename,
        ...{
          userid: _cg(userid),
          userfullname: _cg(username),
          username: _cg(userloginname)
        },
        devicetype: cnDeviceType(true)
      });
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            data: adapter(data),
            refreshing: false,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            activityIndex: data.activityIndex,
            accordionIndex: data.activityIndex > 0 ? [(data.activityIndex - 1).toString()] : ['0']
          },
        });
      } else {
        Toast.fail(data.message || '获取失败');
      }
    },

    * updateDetails ({ payload }, { call, put }) {
      const data = yield call(queryLessonDetails, payload);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            data: adapter(data),
            refreshing: false,
          },
        });
      } else {
        Toast.fail(data.message || '获取失败');
      }
    },

    * queryUrl ({ payload, cb }, { call, put, select }) {
      const { dispatch = '', cmid = '', courseid = '', name = '', ...param } = payload,
        { success, message = '获取文件信息失败。', data = [] } = yield call(url, {
          cmid,
          courseid,
          name,
          ...param
        }),
        targets = {};
      if (success && data.length) {
        const { id: urlId = '', content = [], cmid: ccmId = '', ...otherDatas } = data[0];
        if (dispatch) {
          handlerCourseClick({ content, ...otherDatas, id: ccmId }, courseid, dispatch);
        }
      } else {
        cb && cb();
        Toast.fail(message);
      }
    },
    * queryResource ({ payload, cb }, { call }) {
      const { dispatch = '', cmid = '', courseid = '', instance = '', ...otherDatas } = payload,
        { success, message = '获取文件内容失败。', data = [{}] } = yield call(queryResource, {
          cmid,
          courseid,
          resourceid: instance
        });
      if (success && dispatch) {
        handlerCourseClick({ ...otherDatas, contents: data, id: cmid }, courseid, dispatch);
      } else {
        cb && cb();
        Toast.fail(message);
      }
    },
    * manualCompletion ({ payload, callback }, { call, put, select }) {
      const { users: { userid } } = yield select(_ => _.app);
      const { courseid } = yield select(_ => _.lessondetails);
      const { success, message } = yield call(manualCompletion, payload);
      if (success) {
        yield put({
          type: 'updateDetails',
          payload: { userid, courseid }
        });

        if (callback) yield callback(-1);
      } else {
        Toast.fail(message || '未知错误');
        if (callback) yield callback(-1);
      }
    },
    * queryAppealCount ({ payload, callback }, { call, put }) {
      const { data, success, message } = yield call(queryAppealCount, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: { appealCount: data }
        });
      } else {
        Toast.fail(message || '未知错误');
      }
    },
  },
});
