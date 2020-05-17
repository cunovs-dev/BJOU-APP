import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import * as Service from 'services/resource';
import { routerRedux } from 'dva/router';
import { Toast } from 'components';

export default modelExtend(model, {
  namespace: 'feedback',
  state: {
    data: {}
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, action, query }) => {
        const { id = '', courseid = '', cmid = '' } = query;
        if (pathname === '/feedback') {
          dispatch({
            type: 'queryFeedback',
            payload: {
              id,
              cmid,
              courseid
            }
          });
        }
      });
    },
  },
  effects: {
    * queryFeedback ({ payload }, { call, put }) {
      const data = yield call(Service.queryFeedback, payload);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            data
          }
        });
      } else {
        Toast.fail(data.message || '请稍后再试');
      }
    },
    * sendPatryOpinion ({ payload }, { call, put, select }) {

    },
  }
});
