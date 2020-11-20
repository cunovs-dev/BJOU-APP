import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { queryGraduationInfo } from 'services/app';
import { model } from 'models/common';
import { Toast } from 'components';

export default modelExtend(model, {
  namespace: 'graduationInformation',
  state: {
    list: []
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen(({ pathname, query }) => {
        if (pathname === '/graduationInformation') {
          dispatch({
            type: 'updateState',
            payload: {
              list: []
            }
          });
          dispatch({
            type: 'queryGraduationInfo'
          });
        }
      });
    }
  },
  effects: {
    * queryGraduationInfo ({ payload }, { call, put }) {
      const { code, data, message = '获取信息失败' } = yield call(queryGraduationInfo, payload);
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
