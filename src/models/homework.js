import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { getLocalIcon } from 'utils';
import { model } from 'models/common';
import { routerRedux } from 'dva/router';
import { Toast } from 'components';
import commonMoadl from 'components/commonModal';
import { queryHomework, queryHomeWorkComments, sendAssing } from 'services/resource';

export default modelExtend(model, {
  namespace: 'homework',
  state: {
    data: [],
    comments: [],
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        const { cmid, assignId, courseid } = query;
        if (pathname === '/homework') {
          dispatch({
            type: 'updateState',
            payload: {
              data: [],
              comments: [],
            }
          });
          dispatch({
            type: 'queryHomework',
            payload: {
              cmid,
              ssignId: assignId,
              courseid,
            },
          });
        }
      });
    },
  },
  effects: {
    * queryHomework ({ payload }, { call, put, select }) {
      const { users: { userid } } = yield select(_ => _.app),
        data = yield call(queryHomework, {
          ...payload,
          userid,
        });
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            data,
          },
        });
        if (data.itemid) {
          yield put({
            type: 'queryComments',
            payload: {
              cmid: data.cmid,
              userid,
              itemid: data.itemid,
            },
          });
        }
      } else {
        yield put({ type: 'goBack' });
        Toast.fail('获取信息失败');
      }
    },
    * queryComments ({ payload }, { call, put, select }) {
      const { comments, success, message = '请稍后再试' } = yield call(queryHomeWorkComments, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            comments,
          },
        });
      } else {
        Toast.fail(message);
      }
    },
    * sendAssing ({ payload }, { put, call }) {
      const { cmid, coursesId: courseid, assignmentid } = payload;
      const { success, message = '请稍后再试', modalAlert = false } = yield call(sendAssing, { assignmentid });
      if (success) {
        Toast.success('提交成功');
        yield put({
          type: 'queryHomework',
          payload: {
            cmid,
            ssignId: assignmentid,
            courseid,
          },
        });
      } else {
        modalAlert ? commonMoadl(message) : Toast.fail(message);
      }
    },
  },

});
