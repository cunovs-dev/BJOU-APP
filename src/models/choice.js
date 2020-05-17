import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import * as Service from 'services/resource';
import { routerRedux } from 'dva/router';
import { Toast } from 'components';

export default modelExtend(model, {
  namespace: 'choice',
  state: {
    data: {},
    values: [],
    voteId: '',
    courseid: ''
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, action, query }) => {
        const { voteId = '', courseid = '' } = query;
        if (pathname === '/choice' && action === 'PUSH') {
          dispatch({
            type: 'updateState',
            payload: {
              data: {},
              values: [],
              voteId,
              courseid
            }
          });
          dispatch({
            type: 'querys',
            payload: {
              voteId,
              courseid
            }
          });
        }
      });
    },
  },
  effects: {
    * querys ({ payload }, { call, put, select }) {
      const { page } = yield select(_ => _.choice);
      const { success, data, message = '请稍后再试', hasprevpage, hasnextpage } = yield call(Service.queryChoice, {
        ...payload,
        page
      });
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            data,
          }
        });
      } else {
        Toast.fail(message);
      }
    },
    * sendChoice ({ payload }, { call, put, select }) {
      const { voteId, courseid } = yield select(_ => _.choice);
      const { success, message = '请稍后再试' } = yield call(Service.sendChoice, payload);
      if (success) {
        yield put({
          type: 'querys',
          payload: {
            voteId,
            courseid
          }
        });
      } else {
        Toast.fail(message);
      }
    },
  },

});
