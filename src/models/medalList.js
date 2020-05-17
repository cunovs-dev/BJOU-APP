import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { getLocalIcon } from 'utils';
import { model } from 'models/common';
import { queryMedalList } from 'services/app';

export default modelExtend(model, {
  namespace: 'medalList',
  state: {
    data: [],
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/medalList') {
          dispatch({
            type: 'queryList',
          });
        }
      });
    },
  },
  effects: {
    * queryList ({ payload }, { call, put, select }) {
      const { users: { userid } } = yield select(_ => _.app),
        data = yield call(queryMedalList, { userid });
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            data: data.data,
          },
        });
      }
    },
  },

});
