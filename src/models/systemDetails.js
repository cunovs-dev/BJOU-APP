import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { Toast } from 'components';
import { queryNoticeDetails } from 'services/list';
import { collection } from 'services/app';

const namespace = 'systemDetails';
export default modelExtend(model, {
  namespace,
  state: {
    data: {}
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ query, pathname, action }) => {
        const { informationId = '' } = query;
        if (pathname === `/${namespace}`) {
          if (action === 'PUSH') {
            dispatch({
              type: 'updateState',
              payload: {
                data: {}
              }
            });
            dispatch({
              type: 'query',
              payload: {
                informationId
              }
            });
          }
        }
      });
    }
  },
  effects: {
    * query ({ payload }, { call, put }) {
      const { code, message = '获取失败', data } = yield call(queryNoticeDetails, payload);
      if (code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            data
          }
        });
      } else {
        Toast.fail(message);
      }
    },
    * collection ({ payload }, { call, put }) {
      const { code, message = '获取失败', data } = yield call(collection, payload);
      if (code === 0) {
        yield put({
          type: 'query',
          payload: {
            ...payload
          }
        });
      } else {
        Toast.fail(message);
      }
    }
  }
});
