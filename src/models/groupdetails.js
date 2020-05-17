import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { queryMembers } from 'services/list';
import { model } from 'models/common';

const getDefaultPaginations = () => ({
    nowPage: 1,
    rowCount: 10,
  }),
  namespace = 'groupdetails';

export default modelExtend(model, {
  namespace,
  state: {
    listData: [],
    scrollerTop: 0,
    paginations: getDefaultPaginations(),
    hasMore: true
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        if (pathname === '/groupdetails') {
          const { courseid } = query;
          if (action === 'PUSH') {
            dispatch({
              type: 'updateState',
              payload: {
                paginations: getDefaultPaginations(),
                hasMore: true,
                listData: [],
                scrollerTop: 0,
              }
            });
            dispatch({
              type: 'queryList',
              payload: {
                courseid,
              },
            });
          }
        }
      });
    },
  },

  effects: {
    * queryList ({ payload }, { call, put, select }) {
      const { callback = '', isRefresh = false, courseid } = payload,
        _this = yield select(_ => _[`${namespace}`]),
        { users: { userid } } = yield select(_ => _.app),
        { paginations: { nowPage, rowCount }, listData, } = _this,
        start = isRefresh ? getDefaultPaginations().nowPage : nowPage,
        result = yield call(queryMembers, { courseid, nowPage: start, rowCount, userid });
      if (result.success) {
        let { data = [] } = result,
          newLists = [];
        newLists = start === getDefaultPaginations().nowPage ? data : [...listData, ...data];
        yield put({
          type: 'updateState',
          payload: {
            hasMore: data.length === getDefaultPaginations().rowCount
          }
        });
        if (data.length !== 0) {
          yield put({
            type: 'updateState',
            payload: {
              paginations: {
                ..._this.paginations,
                nowPage: start + 1,
              },
              listData: newLists,
            },
          });
        }
      } else {
        Toast.fail(result.message || '未知错误');
      }
      if (callback) {
        callback();
      }
    },
  },
});
