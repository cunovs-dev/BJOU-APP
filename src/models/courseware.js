import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { queryPlayInfo, addPlayInfo, updatePlayInfo, queryStatus } from 'services/resource';
import { Toast } from 'components';
import { model } from 'models/common';
import { cookie, config } from 'utils';

const { userTag: { userloginname, bkStudentNumber, userid } } = config,
  { _cg } = cookie;
export default modelExtend(model, {
  namespace: 'courseware',
  state: {
    data: {},
    isOpen: false,
    viewImageIndex: -1,
    userLearningFlowID: '',
    showModal: false
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        let { pathname, query = {}, action } = location;
        if (pathname.startsWith('/courseware')) {
          if (action === 'PUSH') {
            const { coursewareID, courseid } = query;
            dispatch({
              type: 'updateState',
              payload: {
                data: {},
                isOpen: false,
                viewImageIndex: -1,
                userLearningFlowID: '',
                isPlay: false
              }
            });
            dispatch({
              type: 'queryDate',
              payload: {
                coursewareID,
                courseid,
                userID: _cg(bkStudentNumber) || _cg(userloginname)
              }
            });
          }
        }
      });
    }
  },
  effects: {
    * queryDate ({ payload }, { call, put }) {
      const { coursewareID, courseid, userID } = payload;
      const { code, data, message = '获取资源失败' } = yield call(queryPlayInfo, {
        coursewareID,
        userID,
        courseID: courseid
      });
      if (code === '2000') {
        yield put({
          type: 'updateState',
          payload: {
            data
          }
        });

        if (data.coursewareType === 5) {
          yield put({
            type: 'addPlayInfo',
            payload: {
              coursewareID,
              sourceType: '1',
              terminal: '2',
              playStartTime: 1,
              courseID: courseid,
              userID: _cg(bkStudentNumber) || _cg(userloginname)
            }
          });
        }
      } else {
        Toast.fail(message);
      }
    },
    * queryStatus ({ payload }, { call, put }) {
      const { cmid, courseid } = payload;
      const { state, success, message = '状态更新失败，请稍后再试' } = yield call(queryStatus, {
        cmid,
        userid: _cg(userid),
        courseid
      });
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            showModal: parseInt(state, 10) === 0
          }
        });
        if (parseInt(state, 10) !== 0) {
          yield put({ type: 'goBack' });
        }
      } else {
        yield put({ type: 'goBack' });
        Toast.fail(message);
      }
    },
    * addPlayInfo ({ payload }, { call, put }) {
      const { code, data, message = '获取资源失败' } = yield call(addPlayInfo, payload);
      if (code === '2000') {
        yield put({
          type: 'updateState',
          payload: {
            userLearningFlowID: data.userLearningFlowID
          }
        });
      } else {
        // Toast.fail(message);
      }
    },
    * updatePlayInfo ({ payload }, { call, put }) {
      const { code, data, message = '获取资源失败' } = yield call(updatePlayInfo, payload);
      if (code === '2000') {

      } else {
        // Toast.fail(message);
      }
    }
  }

});
