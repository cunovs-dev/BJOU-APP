import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import * as Service from 'services/message';
import { Toast } from 'components';
import { model } from 'models/common';

export default modelExtend(model, {
  namespace: 'conversation',
  state: {
    chartArr: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        let { pathname, query, action } = location;
        const { fromuserid, name, unread } = query;
        if (pathname.startsWith('/conversation')) {
          dispatch({
            type: 'updateState',
            payload: {
              chartArr: []
            }
          });
          dispatch({
            type: 'query',
            payload: {
              fromuserid,
              name,
            },
          });
          if (unread) {
            dispatch({
              type: 'readMessage',
              payload: {
                fromuserid,
              }
            });
          }
        }
      });
    },
  },
  effects: {
    * query ({ payload }, { call, put, select }) {
      const { users: { userid } } = yield select(_ => _.app),
        response = yield call(Service.queryConversation, { fromuserid: payload.fromuserid, userid, nowpage: 1 });
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            chartArr: response.data.reverse(),
          },
        });
      }
    },
    * sendTalk ({ payload }, { call, put, select }) {
      const response = yield call(Service.sendTalk, payload),
        { key } = payload,
        { chartArr } = yield select(_ => _.conversation);
      let currentCharArr = [];
      if (response.success === false) {
        chartArr.map((item = {}) => {
          let changes = {};
          if (item.hasOwnProperty('key') && item.key === key) {
            changes.state = 2;
          }
          currentCharArr.push({ ...item, ...changes });
        });
        Toast.offline('请稍后再试');
        yield put({
          type: 'updateState',
          payload: {
            chartArr: currentCharArr,
          },
        });
      } else {
        chartArr.map((item = {}) => {
          let changes = {};
          if (item.hasOwnProperty('key') && item.key === key) {
            changes.state = response.msgid ? 0 : 2;
          }
          currentCharArr.push({ ...item, ...changes });
        });
        yield put({
          type: 'updateState',
          payload: {
            chartArr: currentCharArr,
          },
        });
      }
    },
    * readMessage ({ payload }, { call, put, select }) {
      const { users: { userid } } = yield select(_ => _.app),
        response = yield call(Service.readMessage, { useridto: userid, useridfrom: payload.fromuserid });
      // if (response.success) {
      //   yield put({
      //     type: 'messageCenter/queryCount'
      //   });
      // }
    },
  },
  reducers: {
    appendConversation (state, { payload }) {
      let { chartArr } = state,
        { params = {} } = payload;
      chartArr = [...chartArr, { ...params }];
      return {
        ...state,
        chartArr,
      };
    },
  }

});
