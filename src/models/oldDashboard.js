import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { config, cookie } from 'utils';
import { model } from 'models/common';
import { Toast } from 'components';
import { queryCurrentTask, queryAllTask } from 'services/task';
import * as query from 'services/message';

const { userTag: { userid, usertoken } } = config,
  { _cg } = cookie,
  adapter = (list) => {
    cnIsArray(list) && list.map((item) => {
      item.master = cnIsArray(item.master) && item.master[0] || { fullname: '未知', id: '' };
      item.lessonImage = cnIsArray(item.overviewfiles) && item.overviewfiles.length > 0 ? item.overviewfiles[0].fileurl : '';
    });
    return list;
  };
export default modelExtend(model, {
  namespace: 'oldDashboard',
  state: {
    count: '',
    taskList: [],
    taskAllList: [],
    refreshing: false,
    selectIndex: 0,
    sysNotice: {},
    taskTop: 0,
    lessonTop: 0,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, action }) => {
        if (pathname === '/oldDashboard' || pathname === '/') {
          if (action === 'PUSH') {
            dispatch({
              type: 'updateState',
              payload: {
                taskTop: 0,
                lessonTop: 0,
              }
            });
          }
          dispatch({
            type: 'queryCount',
          });
          dispatch({
            type: 'query',
          });
          dispatch({
            type: 'querySysNotice',
            payload: {
              nowPage: 1,
              pageSize: 10
            }
          });
        }
      });
    },
  },
  effects: {
    * query ({ payload }, { call, put }) {
      if (_cg(usertoken) !== '') {
        const { success, data, message = '请稍后再试' } = yield call(queryCurrentTask, { userid: _cg(userid) });
        if (success) {
          yield put({
            type: 'updateState',
            payload: {
              taskList: data,
              refreshing: false,
            },
          });
        } else {
          Toast.fail(message);
        }
      }
    },
    * queryAllTask ({ payload }, { call, put }) {
      const { success, data, message = '请稍后再试' } = yield call(queryAllTask, { userid: _cg(userid) });
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            taskAllList: adapter(data),
            refreshing: false,
          },
        });
      } else {
        Toast.fail(message);
      }
    },
    * queryCount ({ payload }, { call, put }) {
      const { success, message = '获取失败', messageCount } = yield call(query.queryMessageCount, { userid: _cg(userid) });
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            count: messageCount,
          },
        });
      } else {
        Toast.fail(message);
      }
    },
    * querySysNotice ({ payload }, { call, put }) {
      const { success, data } = yield call(query.querySysNotice, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            sysNotice: data.data[0] || {}
          }
        });
      } else {

      }
    },
  },
});
