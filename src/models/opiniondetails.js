import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { routerRedux } from 'dva/router';
import { queryAppealDetail, readAppeal } from 'services/app';
import { Toast } from 'components';

export default modelExtend(model, {
  namespace: 'opiniondetails',
  state: {
    detail: {},
    id: '',
    isOpen: false,
    viewImageIndex: -1,
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen(({ pathname, query }) => {
        const { id, noticeId } = query;
        dispatch({
          type: 'updateState',
          payload: {
            id
          }
        });
        if (pathname === '/opiniondetails') {
          dispatch({
            type: 'updateState',
            payload: {
              detail: {},
            }
          });
          dispatch({
            type: 'queryDetails',
            payload: {
              opinionId: id
            }
          });
          if (noticeId) {
            dispatch({
              type: 'readAppeal',
              payload: {
                noticeId
              }
            });
          }
        }
      });
    },
  },
  effects: {
    * queryDetails ({ payload }, { call, put, select }) {
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
    * readAppeal ({ payload }, { call, put }) {
      yield call(readAppeal, payload);
    },
  }
});
