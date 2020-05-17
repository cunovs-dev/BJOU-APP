import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import * as Service from 'services/resource';
import { Toast } from 'components';

export default modelExtend(model, {
  namespace: 'feedbackresult',
  state: {
    data: {},
    refreshing: false,
    scrollerTop: 0,
    defaultGroup: [0],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        if (pathname === '/feedbackresult') {
          if (action === 'PUSH') {
            dispatch({
              type: 'updateState',
              payload: {
                data: {},
                refreshing: false,
                scrollerTop: 0,
                defaultGroup: [0],
              }
            });
            dispatch({
              type: 'query',
              payload: {
                ...query
              }
            });
          }
        }
      });
    },
  },

  effects: {
    * query ({ payload }, { call, put, select }) {
      const { users: { userid } } = yield select(_ => _.app),
        { groupid = 0 } = payload,
        data = yield call(Service.queryFeedBackInfos, {
          userid,
          groupid,
          ...payload
        });
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            data,
            refreshing: false,
          },
        });
      } else {
        yield put({ type: 'goBack' });
        Toast.fail(data.message || '未知错误');
      }
    },

  },
});
