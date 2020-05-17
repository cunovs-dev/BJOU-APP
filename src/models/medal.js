import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { queryMedalList } from 'services/app';
import { model } from 'models/common';

const getDetail = (arr, id) => {
  return arr.find(item => item.id === id);
};

export default modelExtend(model, {
  namespace: 'medal',
  state: {
    data: [],
    detail: {},
    id: ''
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        const { id } = query;
        dispatch({
          type: 'updateState',
          payload: {
            id
          }
        });
        if (pathname === '/medal') {
          dispatch({
            type: 'updateState',
            payload: {
              detail: {},
            }
          });
          dispatch({
            type: 'queryList',
          });
        }
      });
    },
  },
  effects: {
    * queryList ({ payload }, { call, put, select }) {
      const { users: { userid } } = yield select(_ => _.app),
        { id } = yield select(_ => _.medal),
        data = yield call(queryMedalList, { userid });
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            data: data.data,
          },
        });
        yield put({
          type: 'queryDetails',
          payload: {
            id
          }
        });
      }
    },
    * queryDetails ({ payload }, { call, put, select }) {
      const { data } = yield select(_ => _.medal),
        { id } = payload;
      yield put({
        type: 'updateState',
        payload: {
          detail: getDetail(data, id * 1),
        },
      });
    },
  },

});
