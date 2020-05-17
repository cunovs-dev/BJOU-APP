import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { Toast } from 'components';
import { queryMyOpinionList } from 'services/list';


export default modelExtend(model, {
  namespace: 'myopinion',
  state: {
    list: [],
    refreshing: false,
    scrollerTop: 0
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/myopinion') {
          dispatch({
            type: 'updateState',
            payload: {
              list: [],
              refreshing: false,
              scrollerTop: 0
            }
          });
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
        { success, message = '获取失败', data } = yield call(queryMyOpinionList, { userid });
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            list: data,
            refreshing: false,
          },
        });
      } else {
        Toast.fail(message);
      }
    },

  },
});
