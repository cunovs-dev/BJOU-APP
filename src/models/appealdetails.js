import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { replyAppeal, queryUserInfo, queryAppealDetail } from 'services/app';
import { routerRedux } from 'dva/router';
import { Toast } from 'components';

export default modelExtend(model, {
  namespace: 'appealdetails',
  state: {
    detail: {},
    opinionId: '',
    isOpen: false,
    viewImageIndex: -1,
    userInfo: {}
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen(({ pathname, query }) => {
        const { opinionId } = query;
        dispatch({
          type: 'updateState',
          payload: {
            opinionId
          }
        });
        if (pathname === '/appealdetails') {
          dispatch({
            type: 'updateState',
            payload: {
              detail: {},
            }
          });
          dispatch({
            type: 'queryDetails',
            payload: {
              opinionId
            }
          });
        }
      });
    },
  },
  effects: {
    * queryInfo ({ payload }, { call, put, }) {
      const data = yield call(queryUserInfo, payload);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            userInfo: data,
          },
        });
      }
    },
    * queryDetails ({ payload }, { call, put }) {
      const { data = {}, success } = yield call(queryAppealDetail, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            detail: data
          },
        });
      }
    },
    * replyAppeal ({ payload }, { call, put, }) {
      const { success, msg } = yield call(replyAppeal, payload);
      if (success) {
        yield put({ type: 'goBack' });
        Toast.success(msg || '回复成功', 2);
      } else {
        Toast.fail(msg || '回复失败', 2);
      }
    },
  }
});
