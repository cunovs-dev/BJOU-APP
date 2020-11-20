import { routerRedux } from 'dva/router';
import { Toast } from 'antd-mobile';
import modelExtend from 'dva-model-extend';
import CryptoJS from 'crypto-js';
import {
  firstUpdatePassword,
  queryPasswordRule,
  queryResetTypes,
  sendCodeWithToken,
  updatePhoneOrEmail,
  validRule
} from 'services/setup';
import { config, cookie } from 'utils';
import { pageModel } from './common';

const { userTag: { portalToken } } = config,
  { _cg } = cookie;
const encrypt = (word) => {
  return CryptoJS.SHA1(word)
    .toString();
};
export default modelExtend(pageModel, {
  namespace: 'firstLogin',

  state: {
    rules: {},
    phoneNumber: '未绑定',
    mailNumber: '未绑定'
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query }) => {
        const { userId = '' } = query;
        if (pathname === '/firstLogin') {
          dispatch({
            type: 'queryResetTypes',
            payload: {
              userId
            }
          });
        }
      });
    }
  },
  effects: {
    * queryResetTypes ({ payload }, { call, put }) {
      const { data, code, message = '请稍后再试' } = yield call(queryResetTypes, payload);
      if (code === 0) {
        if (data.length === 2) {
          yield put({
            type: 'updateState',
            payload: {
              phoneNumber: data[0].receiveNumber,
              mailNumber: data[1].receiveNumber
            }
          });
        }
        if (data.length === 1) {
          if (data[0].receiveType === 'phone') {
            yield put({
              type: 'updateState',
              payload: {
                phoneNumber: data[0].receiveNumber
              }
            });
          } else if (data[0].receiveType === 'email') {
            yield put({
              type: 'updateState',
              payload: {
                mailNumber: data[0].receiveNumber
              }
            });
          }
        }

      } else {
        Toast.fail(message);
      }
    },

    * sendCodeWithToken ({ payload }, { call, put }) {
      const { data, code, message = '请稍后再试' } = yield call(sendCodeWithToken, payload);
      if (code === 0) {

      } else {
        Toast.fail(message);
      }
    },

    * updatePhoneOrEmail ({ payload }, { call, put }) {
      const { data, code, message = '请稍后再试' } = yield call(updatePhoneOrEmail, payload);
      if (code === 0) {
        yield put({ type: 'goBack' });
        Toast.success('绑定成功');
      } else {
        Toast.fail(message);
      }
    },

    * firstUpdatePassword ({ payload }, { call, put }) {
      const { password = '' } = payload;
      const { data, code, message = '请稍后再试' } = yield call(firstUpdatePassword, {
        ...payload,
        password: encrypt(password)
      });
      if (code === 0) {
        yield put(routerRedux.push({
          pathname: '/',
          query: {
            orgCode: _cg('orgCode')
          }
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
