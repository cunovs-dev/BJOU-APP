import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { queryUserInfo, queryPortalUser, queryStudentInfo } from 'services/app';
import { bkIdentity, config, cookie } from 'utils';
import { Toast } from 'components';

const { userTag: { portalToken } } = config,
  { _cg } = cookie;
export default modelExtend(model, {
  namespace: 'homepage',
  state: {
    data: {},
    gkData:{}
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        let { pathname } = location;
        if (pathname.startsWith('/homepage')) {
          dispatch({
            type: 'updateState',
            payload: {
              data: {}
            }
          });
          dispatch({
            type: 'query',
            payload: bkIdentity() ? {} : { access_token: _cg(portalToken) }
          });
          if (!bkIdentity()) {
            dispatch({
              type: 'queryStudentInfo'
            });
          }
        }
      });
    }
  },
  effects: {

    * query ({ payload }, { call, put }) {
      const { data = {}, code, message = '请稍后再试' } = yield call(bkIdentity() ? queryUserInfo : queryPortalUser, payload, true);
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
    * queryStudentInfo ({ payload }, { call, put }) {
      const { data = {}, code, message = '请稍后再试' } = yield call(queryStudentInfo, payload);
      if (code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            gkData: cnIsArray(data) ? data[0] : {}
          }
        });
      } else {
        Toast.fail(message);
      }
    }
  }

});
