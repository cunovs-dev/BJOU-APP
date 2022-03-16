import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { Toast } from 'components';
import { url } from 'services/resource';

export default modelExtend(model, {
  namespace: 'url',
  state: {
    content: '',
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        const { cmid = '' } = query;
        if (pathname === '/url') {
          if (action === 'PUSH') {
            dispatch({
              type: 'query',
              payload: {
                cmid
              }
            });
          }
        }
      });
    },
  },
  effects: {
    * query ({ payload }, { call, put, select }) {
      const { success, message = '获取失败', data } = yield call(url, payload);
      if (success) {
      } else {
        Toast.fail(message);
      }
    },
  }
});
