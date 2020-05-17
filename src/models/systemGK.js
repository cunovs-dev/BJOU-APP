import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { Toast } from 'components';
import { queryNoticeList } from 'services/list';

const namespace = 'systemGK';
const getDefaultPaginations = () => ({
  count: 0,
  currentPage: 1,
  pageSize: 10
});
export default modelExtend(model, {
  namespace,
  state: {
    list: [],
    scrollerTop: 0,
    paginations: getDefaultPaginations()
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, action }) => {
        if (pathname === `/${namespace}`) {
          if (action === 'PUSH') {
            dispatch({
              type: 'updateState',
              payload: {
                list: [],
                scrollerTop: 0,
                paginations: getDefaultPaginations()
              }
            });
            dispatch({
              type: 'queryList',
              payload: {
                categoryId: 'gktzgg'
              }
            });
          }
        }
      });
    }
  },
  effects: {
    * queryList ({ payload = {}, callback }, { call, put, select }) {
      const { isRefresh = false } = payload,
        _this = yield select(_ => _[`${namespace}`]),
        { paginations: { currentPage, pageSize }, list } = _this,
        start = isRefresh ? 1 : currentPage;
      const { code, data, message, count = 0 } = yield call(queryNoticeList, {
        params: { ...payload },
        page: { currentPage: start, pageSize }
      });
      if (code === 0) {
        let newLists = [];
        newLists = start === 1 ? data : [...list, ...data];
        yield put({
          type: 'updateState',
          payload: {
            paginations: {
              ..._this.paginations,
              count,
              currentPage: start + 1
            },
            list: newLists
          }
        })
        ;
      } else {
        Toast.fail(message);
      }
      if (callback) {
        callback();
      }
    }
  }
});
