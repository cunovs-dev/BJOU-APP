import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { queryStudentInfo } from 'services/app';
import { Toast } from 'components';

export default modelExtend(model, {
  namespace: 'studentStatusGK',
  state: {
    data: {}
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        let { pathname } = location;
        if (pathname.startsWith('/studentStatusGK')) {
          dispatch({
            type: 'updateState',
            payload: {
              data: {}
            }
          });
          dispatch({
            type: 'query'
          });
        }
      });
    }
  },
  effects: {
    * query ({ payload }, { call, put }) {
      const { data = {}, code, message = '请稍后再试' } = yield call(queryStudentInfo, payload);
      if (code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            data: cnIsArray(data) ? data[0] : {}
          }
        });
      } else {
        Toast.fail(message);
      }
    }
  }

});
