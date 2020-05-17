import { routerRedux } from 'dva/router';
import { Toast } from 'antd-mobile';
import modelExtend from 'dva-model-extend';
import md5 from 'md5';
import { sendCode, verifyCode, resetPassword, queryPasswordRule, queryResetTypes, queryAccount } from 'services/setup';
import { pageModel } from './common';

const encrypt = (word) => {
  return md5(word, 'hex');
};
export default modelExtend(pageModel, {
  namespace: 'resetPassword',

  state: {
    rules: {}
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname.startsWith('/resetPassword')) {
          dispatch({
            type: 'updateState',
            payload: {
              disabled: false
            }
          });
        }
      });
    }
  },
  effects: {
    * sendCode ({ payload }, { call, put }) {
      const { code, message = '请稍后再试' } = yield call(sendCode, payload);
      if (code === 0) {

      } else {
        Toast.fail(message);
      }
    },

    * queryAccount ({ payload }, { call, put }) {
      const { data, code, message = '请稍后再试' } = yield call(queryAccount, payload);
      if (code === 0) {
        yield put({
          type: 'queryResetTypes',
          payload: {
            userId: data
          }
        });
      } else {
        Toast.fail(message);
      }
    },

    * queryResetTypes ({ payload }, { call, put }) {
      const { data, code, message = '请稍后再试' } = yield call(queryResetTypes, payload);
      const { userId } = payload;
      if (code === 0) {
        if (cnIsArray(data) && data.length === 2) {
          yield put(routerRedux.push({
            pathname: '/resetPassword/phoneReset',
            query: {
              userId,
              [data[0].receiveType]: data[0].receiveNumber,
              [data[1].receiveType]: data[1].receiveNumber
            }
          }));
        } else if (cnIsArray(data) && data.length === 1) {
          const type = data[0].receiveType;
          yield put(routerRedux.push({
            pathname: `/resetPassword/${type === 'phone' ? 'phoneReset' : 'mailReset'}`,
            query: {
              userId,
              [data[0].receiveType]: data[0].receiveNumber
            }
          }));
        }
      } else {
        Toast.fail(message);
      }
    },

    * verifyCode ({ payload }, { call, put }) {
      const { code: vaildCode, userId } = payload;
      const { data, code, message = '验证码有误' } = yield call(verifyCode, payload);
      if (code === 0 && data) {
        yield put(routerRedux.push({
          pathname: '/resetPassword/setPassword',
          query: {
            code: vaildCode,
            userId
          }
        }));
      } else {
        Toast.fail(message || '验证码有误');
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
          pathname: '/resetPassword/successPage'
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
