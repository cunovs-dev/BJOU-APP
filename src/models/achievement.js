import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import * as queryList from 'services/list';
import { model } from 'models/common';


export default modelExtend(model, {
  namespace: 'achievement',
  state: {
    listData: [],
    scrollerTop: 0,
    refreshing: false
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        if (pathname === '/achievement') {
          if (action === 'PUSH') {
            dispatch({
              type: 'updateState',
              payload: {
                listData: [],
                scrollerTop: 0,
                refreshing: false
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
      const { data, success, message = '请稍后再试' } = yield call(queryList.queryGradeCourseList, { userid });
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
