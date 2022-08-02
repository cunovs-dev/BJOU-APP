import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { pcLogin, queryPcPassword } from 'services/login';
import { routerRedux } from 'dva/router';
import { cookie, config } from 'utils';
import { Toast } from 'components';

const { userTag: { bkStudentNumber } } = config,
  { _cg } = cookie;

export default modelExtend(model, {
  namespace: 'oauth',
  state: {
    appType: null
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, action, query }) => {
        const { appType } = query;
        if (pathname === '/oauth' && action === 'PUSH') {
          dispatch({
            type: 'updateState',
            payload: {
              appType
            }
          });
          dispatch({
            type: 'queryPcPassword',
            payload: {
              credential: 'XoBjou60!'
            }
          });
        }
      });
    }
  },
  effects: {

    * queryPcPassword ({ payload }, { call, put }) {
      const { data, message = '请稍后再试' } = yield call(queryPcPassword, payload);
      if (data) {
        yield put({
          type: 'pcLogin',
          payload: {
            username: _cg(bkStudentNumber),
            password: data,
            loginMode: 'PasswordLogin'
          }
        });
      } else {
        Toast.fail(message);
      }
    },
    * pcLogin ({ payload }, { call, select }) {
      const { appType } = yield select(_ => _.oauth);
      const { success } = yield call(pcLogin, payload);
      if (success) {
        cnOpen(appsUrl[appType]);
      }
    }
  }
});
