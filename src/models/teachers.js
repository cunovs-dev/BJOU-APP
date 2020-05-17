import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import * as queryList from 'services/list';
import { model } from 'models/common';

const getTeachers = (arr) => {
  return arr.filter(item => item.hasOwnProperty('mentors'));
};

export default modelExtend(model, {
  namespace: 'teachers',
  state: {
    listData: [],
    refreshing: false,
    scrollerTop: 0
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        if (pathname === '/teachers') {
          if (action === 'PUSH') {
            dispatch({
              type: 'updateState',
              payload: {
                listData: [],
                refreshing: false,
                scrollerTop: 0
              }
            });
            dispatch({
              type: 'queryList',
            });
          }
        }
      });
    },
  },

  effects: {
    * queryList (_, { call, put, select }) {
      const { users: { userid } } = yield select(_ => _.app),
        response = yield call(queryList.queryTeachers, { userid });
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listData: getTeachers(response.mentors),
            refreshing: false,
          },
        });
      }
    },

  },
});
