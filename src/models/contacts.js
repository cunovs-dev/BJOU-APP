import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { queryContacts } from 'services/list';
import { model } from 'models/common';

export default modelExtend(model, {
  namespace: 'contacts',
  state: {
    onLine: [],
    offLine: []
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        let { pathname, query, action } = location;
        if (pathname.startsWith('/contacts')) {
          if (action === 'PUSH') {
            dispatch({
              type: 'query',
            });
          }
        }
      });
    },
  },
  effects: {
    * query ({ payload }, { call, put, select }) {
      const { users: { userid } } = yield select(_ => _.app);
      const response = yield call(queryContacts, { userid });
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            onLine: response.online,
            offLine: response.offline,
          }
        });
      }
    },
  }

});
