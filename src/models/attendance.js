import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { getAttendanceList } from 'services/app';
import { model } from 'models/common';
import { Toast } from 'components';


export default modelExtend(model, {
  namespace: 'attendance',
  state: {
    listData: [],
    refreshing: false,
    scrollerTop: 0
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        if (pathname === '/attendance') {
          if (action === 'PUSH') {
            dispatch({
              type: 'updateState',
              payload: {
                listData: [],
                refreshing: false,
                scrollerTop: 0
              }
            });
            dispatch({
              type: 'queryList',
            });
          }
        }
      });
    },
  },

  effects: {
    * queryList (_, { call, put, select }) {
      const { users: { userid } } = yield select(k => k.app);
      const { data, success, message = '请稍后再试' } = yield call(getAttendanceList, { userid });
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listData: data,
          },
        });
      } else {
        Toast.fail(message);
      }
    },
  },
});
