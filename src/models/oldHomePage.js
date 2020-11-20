import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { queryPersonal } from 'services/app';
import cookie from 'utils/cookie';
import config, { userTag } from 'utils/config';

const { userTag: { username, useravatar } } = config,
  { _cs } = cookie;
export default modelExtend(model, {
  namespace: 'oldHomePage',
  state: {
    data: {},
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        let { pathname, action } = location;
        if (pathname.startsWith('/oldHomePage')) {
          dispatch({
            type: 'updateState',
            payload: {
              data: {},
            }
          });
          dispatch({
            type: 'query',
          });
        }
      });
    },
  },
  effects: {
    * query ({ payload }, { call, put, select }) {
      const { users: { userid } } = yield select(_ => _.app),
        data = yield call(queryPersonal, { userid });
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            data
          }
        });
        _cs(username, data.fullname);
        _cs(useravatar, data.avatar);
      } else {
        Toast.fail(data.message || '获取失败');
      }
    },
  },

});
