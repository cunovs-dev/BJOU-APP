import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { queryResetTypes, sendCode, resetPassword, queryPasswordRule, validRule } from 'services/setup';
import { checkFirstLogin } from 'services/app';
import { cookie, config } from 'utils';
import { routerRedux } from 'dva/router';
import CryptoJS from 'crypto-js';
import { Toast } from 'components';

const { userTag: { portalToken } } = config;
const { _cg } = cookie;
const encrypt = (word) => {
  return CryptoJS.SHA1(word)
    .toString();
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
              type: 'checkFirstLogin',
              payload: {
                access_token: _cg(portalToken)
              }
            });
          }
          // dispatch({ //改为后台验证不需要请求规则接口了
          //   type: 'queryPasswordRule'
          // });
        }
      });
    }
  },
  effects: {
    * checkFirstLogin ({ payload }, { call, put }) {
      const { data = {}, code, message = '请稍后再试' } = yield call(checkFirstLogin, payload);
      if (code === 0) {
        const { userId } = data;
        yield put({
          type: 'queryResetTypes',
          payload: {
            userId
          }
        });
      } else {
        Toast.fail(message);
      }
    },
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
    },
    * validRule ({ payload, callback }, { call, put }) {
      const { data = {}, code, message = '请稍后再试' } = yield call(validRule, payload);
      if (code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            rules: data
          }
        });
        if (callback) callback();
      } else {
        Toast.fail(message);
      }
    }
  }

});
