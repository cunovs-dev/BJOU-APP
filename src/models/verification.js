import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { queryResetTypes, sendCode, verifyCode } from 'services/setup';
import { checkFirstLogin } from 'services/app';
import { cookie, config } from 'utils';
import { routerRedux } from 'dva/router';
import { Toast } from 'components';
import { model } from 'models/common';

const { userTag: { portalToken } } = config;
const { _cg } = cookie;
export default modelExtend(model, {
  namespace: 'verification',
  state: {
    data: [],
    codeType: ''
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        let { pathname, action, query } = location;
        const { type } = query;
        if (pathname.startsWith('/verification')) {
          if (action === 'PUSH') {
            dispatch({
              type: 'updateState',
              payload: {
                codeType: type
              }
            });
            dispatch({
              type: 'checkFirstLogin',
              payload: {
                access_token: _cg(portalToken)
              }
            });
          }
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
    * verifyCode ({ payload }, { call, put, select }) {
      const { data, code, message = '验证码有误' } = yield call(verifyCode, payload);
      if (code === 0 && data) {
        const { codeType } = yield select(_ => _.verification);
        yield put(routerRedux.push({
          pathname: 'setPhoneOrMail',
          query: {
            codeType
          }
        }));
      } else {
        Toast.fail(message || '验证码有误');
      }
    }
  }

});
