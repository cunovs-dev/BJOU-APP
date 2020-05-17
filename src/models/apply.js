import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { getLocalIcon } from 'utils';
import { Toast } from 'components';
import { model } from 'models/common';
import { queryApplyList } from 'services/list';


export default modelExtend(model, {
  namespace: 'apply',
  state: {
    list: []
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/apply') {
          dispatch({
            type: 'queryList'
          });
        }
      });
    }
  },
  effects: {
    * queryList ({ payload }, { call, put }) {
      const { code, message = '获取信息失败', data } = yield call(queryApplyList);
      if (code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            list: data
          }
        });
      } else {
        Toast.fail(message);
      }
    }
  }
});
