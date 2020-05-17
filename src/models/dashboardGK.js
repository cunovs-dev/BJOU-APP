import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { Toast } from 'components';
import { bkIdentity } from 'utils';
import { queryNoticeList } from 'services/list';

export default modelExtend(model, {
  namespace: 'dashboardGK',
  state: {
    list: [],
    refreshing: false,
    scrollerTop: 0
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, action }) => {
        if (pathname === '/' && !bkIdentity()) {
          if (action === 'PUSH') {
            dispatch({
              type: 'updateState',
              payload: {
                scrollerTop: 0
              }
            });
          }
          dispatch({
            type: 'queryList',
            payload: {
              categoryId: 'gktzgg'
            }
          });
        }
      });
    }
  },
  effects: {
    * queryList ({ payload }, { call, put }) {
      const { code, message = '获取失败', data } = yield call(queryNoticeList, { params: { ...payload } });
      if (code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            list: data,
            refreshing: false
          }
        });
      } else {
        Toast.fail(message);
      }
    }
  }
});
