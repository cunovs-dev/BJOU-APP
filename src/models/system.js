import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { Toast } from 'components';
import { queryNoticeList, queryNoticeTabs } from 'services/list';
import { queryPortalToken, portalLogin, authentication } from 'services/login';

const namespace = 'system';
const getDefaultPaginations = () => ({
  count: 0,
  currentPage: 1,
  pageSize: 10
});
const getTabs = (arr) => {
  if (cnIsArray(arr)) {
    return JSON.parse(JSON.stringify(arr)
      .replace(/categoryName/g, 'title'));
  }
  return [];
};
export default modelExtend(model, {
  namespace,
  state: {
    list: [],
    scrollerTop: 0,
    paginations: getDefaultPaginations(),
    categoryId: '',
    selectIndex: 0,
    tabs: [],
    searchVal: ''
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
                selectIndex: 0,
                categoryId: '',
                paginations: getDefaultPaginations()
              }
            });
            dispatch({
              type: 'queryNoticeTabs',
              payload: {
                parentId: 'tzgl'
              }
            });
            // dispatch({
            //   type: 'authentication'
            // });
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
    },
    * queryNoticeTabs ({ payload }, { call, put }) {
      const { code, data = [], message = '请稍后再试' } = yield call(queryNoticeTabs, payload);
      if (code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            tabs: getTabs(data) || [],
            categoryId: data[0].categoryId || ''
          }
        });
        yield put({
          type: 'queryList',
          payload: {
            categoryId: data[0].categoryId || ''
          }
        });
      } else {
        Toast.fail(message, 2);
      }
    },
    * authentication ({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          buttonState: false
        }
      });
      const { code, data, message = '请稍后再试' } = yield call(authentication, payload, true);
      if (code === 0) {

        yield put({
          type: 'queryPortalToken'
        });
      } else {
        yield put({
          type: 'updateState',
          payload: {
            buttonState: true
          }
        });
        Toast.fail(message);
      }
    }
  }
});
