import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import * as Services from 'services/list';

const getDefaultPaginations = () => ({
    nowPage: 1,
    pageSize: 10,
  }),
  namespace = 'appeallist';

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
        const { courseid } = query;
        if (pathname === '/appeallist') {
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
            }
          });
        }
      });
    },
  },

  effects: {
    * queryList ({ payload }, { call, put, select }) {
      const { callback = '', isRefresh = false, courseid } = payload,
        _this = yield select(_ => _[`${namespace}`]),
        { paginations: { nowPage, pageSize }, listData, } = _this,
        start = isRefresh ? getDefaultPaginations().nowPage : nowPage,
        result = yield call(Services.queryAppealList, { courseId: courseid, nowPage: start, pageSize });
      if (result.success) {
        let { data: { data = [] } } = result,
          newLists = [];
        newLists = start === getDefaultPaginations().nowPage ? data : [...listData, ...data];
        yield put({
          type: 'updateState',
          payload: {
            hasMore: data.length === getDefaultPaginations().pageSize
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
