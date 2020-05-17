import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { Toast } from 'components';
import { queryCourseGK } from 'services/list';


export default modelExtend(model, {
  namespace: 'courseGK',
  state: {
    data: {},
    refreshing: false,
    scrollerTop: 0
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, action }) => {
        if (pathname === '/courseGK' && action === 'PUSH') {
          dispatch({
            type: 'updateState',
            payload: {
              list: [],
              refreshing: false,
              scrollerTop: 0
            }
          });
          dispatch({
            type: 'queryList'
          });
        }
      });
    }
  },

  effects: {
    * queryList ({ payload }, { call, put }) {
      const { code, message = '获取失败', data } = yield call(queryCourseGK);
      if (code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            data,
            refreshing: false
          }
        });
      } else {
        Toast.fail(message);
      }
    }

  }
});
