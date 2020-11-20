import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { queryPlayInfo, addPlayInfo, updatePlayInfo } from 'services/resource';
import { Toast } from 'components';
import { model } from 'models/common';
import { cookie, config } from 'utils';

const { userTag: { userloginname,bkStudentNumber } } = config,
  { _cg } = cookie;
export default modelExtend(model, {
  namespace: 'courseware',
  state: {
    data: {},
    isOpen: false,
    viewImageIndex: -1,
    userLearningFlowID: ''
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
        Toast.fail(message);
      }
    },
    * updatePlayInfo ({ payload }, { call, put }) {
      const { code, data, message = '获取资源失败' } = yield call(updatePlayInfo, payload);
      if (code === '2000') {

      } else {
        Toast.fail(message);
      }
    }
  }

});
