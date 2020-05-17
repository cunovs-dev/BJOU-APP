import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { Toast } from 'components';
import * as query from 'services/message';

const namespace = 'messageCenter',
  getDefaultPaginations = () => ({
    sysNowPage: 1,
    sysPageSize: 10,
    sysTotal: 0
  });
export default modelExtend(model, {
  namespace,
  state: {
    count: {},
    talkList: [],
    messageList: [],
    sysList: [],
    selectIndex: 0,
    nowPage: 0,
    readstart: 0,
    unreadstart: 0,
    hasMoreMessage: false,
    hasMoreTalk: true,
    isload: false,
    type: 'queryMessage',
    paginations: getDefaultPaginations(),
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen(({ pathname, action }) => {
        if (pathname === '/messageCenter') {
          dispatch({
            type: 'queryCount',
          });
          if (action === 'PUSH') {
            dispatch({
              type: 'updateState',
              payload: {
                count: {},
                talkList: [],
                messageList: [],
                selectIndex: 0,
                hasMoreMessage: false,
                hasMoreTalk: true,
                isload: false,
                nowPage: 0,
                readstart: 0,
                unreadstart: 0,
                type: 'queryMessage',
                paginations: getDefaultPaginations()
              }
            });
            dispatch({
              type: 'queryMessage',
              payload: {
                nowPage: 0
              }
            });
          }
        }
      });
    }
    ,
  },
  effects: {
    * queryCount ({ payload }, { call, put, select }) {
      const { users: { userid } } = yield select(_ => _.app),
        data = yield call(query.queryMessageCount, { userid });
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            count: data,
          },
        });
      } else {
        Toast.fail(data.message);
      }
    },
    * queryMessage ({ payload }, { call, put, select }) {
      const { callback = '', isRefresh = false } = payload,
        _this = yield select(_ => _[`${namespace}`]),
        { users: { userid } } = yield select(_ => _.app),
        { nowPage, messageList, } = _this,
        start = isRefresh ? 0 : nowPage,
        result = yield call(query.queryMessage, { nowPage: start, userid });
      if (result.success) {
        let { data = [] } = result;
        let newLists = [];
        newLists = start === 0 ? data : [...messageList, ...data];
        yield put({
          type: 'updateState',
          payload: {
            nowPage: start + 1,
            messageList: newLists,
            isload: true,
            hasMoreMessage: data.length > 10
          },
        });
      } else {
        Toast.fail(result.message || '未知错误');
      }
      if (callback) {
        callback();
      }
    },
    * queryTalkMessage ({ payload }, { call, put, select }) {
      const { callback = '', isRefresh = false } = payload,
        _this = yield select(_ => _[`${namespace}`]),
        { users: { userid } } = yield select(_ => _.app),
        { readstart, unreadstart, talkList } = _this,
        newreadstart = isRefresh ? 0 : readstart,
        newunreadstart = isRefresh ? 0 : unreadstart,
        result = yield call(query.queryTalkMessage, { readstart: newreadstart, unreadstart: newunreadstart, userid });
      if (result.success) {
        let { listData = [] } = result;
        let newLists = [];
        newLists = isRefresh ? listData : [...talkList, ...listData];
        yield put({
          type: 'updateState',
          payload: {
            readstart: result.readend,
            unreadstart: result.unreadend,
            talkList: newLists,
            hasMoreTalk: listData.length > 10
          },
        });
      } else {
        Toast.fail(result.message || '未知错误');
      }
      if (callback) {
        callback();
      }
    },
    * querySysNotice ({ payload }, { call, put, select }) {
      const { callback = '', isRefresh = false, } = payload,
        { users: { userid: userId } } = yield select(_ => _.app),
        _this = yield select(_ => _[`${namespace}`]),
        { paginations: { sysNowPage, sysPageSize }, sysList } = _this,
        start = isRefresh ? 1 : sysNowPage,
        result = yield call(query.querySysNotice, { nowPage: start, pageSize: sysPageSize, userId });
      if (result) {
        let { data = [], totalCount = 0 } = result,
          newLists = [];
        newLists = start == 1 ? data : [...sysList, ...data];
        yield put({
          type: 'updateState',
          payload: {
            paginations: {
              ..._this.paginations,
              total: totalCount * 1,
              sysNowPage: start + 1,
              isload: false
            },
            sysList: newLists
          },
        });
      }
      if (callback) {
        callback();
      }
    },
    * readNotice ({ payload }, { call, put, select }) {
      const { users: { userid } } = yield select(_ => _.app),
        response = yield call(query.readNotice, { userid, ...payload });
      if (response.success) {

      }
    },
  },

});
