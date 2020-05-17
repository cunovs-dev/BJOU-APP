import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { Toast } from 'components';
import { isRouterNeedRefresh } from 'utils';
import { queryForum, addNewForum } from 'services/forum';

const getDefaultPaginations = () => ({
    page: 0,
    perpage: 10,
  }),
  namespace = 'forum';

export default modelExtend(model, {
  namespace,
  state: {
    data: {},
    scrollerTop: 0,
    paginations: getDefaultPaginations(),
    hasMore: true,
  },
  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen(({ pathname, action, query }) => {
        if (pathname === '/forum') {
          const { cmid, courseid, forumid } = query;
          if (action === 'PUSH' || isRouterNeedRefresh('forum')) {
            dispatch({
              type: 'updateState',
              payload: {
                data: {},
                scrollerTop: 0,
                paginations: getDefaultPaginations(),
                hasMore: true
              },
            });
            dispatch({
              type: 'queryList',
              payload: {
                courseid,
                forumid,
                cmid,
              },
            });
          }
        }
      });
    },
  },
  effects: {
    * queryList ({ payload }, { call, put, select }) {
      const { callback = '', isRefresh = false, courseid, cmid, forumid } = payload,
        _this = yield select(_ => _[`${namespace}`]),
        { paginations: { page, perpage }, data } = _this,
        start = isRefresh ? getDefaultPaginations().page : page,
        result = yield call(queryForum, { courseid, cmid, forumid, page: start, perpage });
      if (result.success) {
        let newData = result,
          hasMore = false;
        // numdiscussions为回复总个数。
        // eslint-disable-next-line no-prototype-builtins
        if (result.hasOwnProperty('numdiscussions')) {
          hasMore = (data.discussions || []).length + newData.discussions.length < result.numdiscussions;
        } else if (newData.discussions.length === perpage) {
          const resultNext = yield call(queryForum, { courseid, cmid, forumid, page: start, perpage });
          hasMore = resultNext.discussions.length > 0;
        }
        yield put({
          type: 'updateState',
          payload: {
            paginations: {
              ..._this.paginations,
              page: start + 1
            },
            data: start === getDefaultPaginations().page ? newData : {
              ...data,
              discussions: [...data.discussions || [], ...newData.discussions]
            },
            hasMore
          },
        });
      } else {
        yield put({ type: 'goBack' });
        Toast.fail(result.message || '未知错误');
      }
      if (callback) {
        callback();
      }
    },
  },
});
