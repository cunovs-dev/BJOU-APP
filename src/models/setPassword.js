import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { queryResetTypes, sendCode, resetPassword, queryPasswordRule } from 'services/setup';
import { cookie, config } from 'utils';
import { routerRedux } from 'dva/router';
import md5 from 'md5';
import { Toast } from 'components';

const { userTag: { portalUserId } } = config;
const { _cg } = cookie;
const encrypt = (word) => {
  return md5(word, 'hex');
};
export default modelExtend(model, {
  namespace: 'setPassword',
  state: {
    data: [],
    rules: {}
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        let { pathname, action } = location;
        if (pathname.startsWith('/setPassword')) {
          if (action === 'PUSH') {
            dispatch({
              type: 'queryResetTypes',
              payload: {
                userId: _cg(portalUserId)
              }
            });
            dispatch({
              type: 'queryPasswordRule'
            });
          }
        }
      });
    }
  },
  effects: {
    * queryResetTypes ({ payload }, { call, put }) {
      const { data = [], code, message = '请稍后再试' } = yield call(queryResetTypes, payload);
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
    * sendCode ({ payload }, { call, put }) {
      const { data = [], code, message = '请稍后再试' } = yield call(sendCode, payload);
      if (code === 0) {

      } else {
        Toast.fail(message);
      }
    },
    * resetPassword ({ payload }, { call, put }) {
      const { password = '' } = payload;
      const { data, code, message = '请稍后再试' } = yield call(resetPassword, {
        ...payload,
        password: encrypt(password)
      });
      if (code === 0) {
        yield put(routerRedux.replace({
          pathname: '/setup'
        }));
        Toast.success('修改成功');
      } else {
        Toast.fail(message);
      }
    },
    * queryPasswordRule ({ payload }, { call, put }) {
      const { data = {}, code, message = '请稍后再试' } = yield call(queryPasswordRule, payload);
      if (code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            rules: data
          }
        });
      } else {
        Toast.fail(message);
      }
    }
  }

});
