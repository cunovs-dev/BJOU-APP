import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { config, cookie, bkIdentity } from 'utils';
import { model } from 'models/common';
import { Toast } from 'components';
import { allModule } from 'utils/defaults';
import { queryCurrentTask, queryAllTask } from 'services/task';
import { queryMenus, queryPaymentState } from 'services/app';
import * as query from 'services/message';

const { userTag: { userid, usertoken } } = config,
  { _cg, _cs } = cookie,
  adapter = (list) => {
    cnIsArray(list) && list.map((item) => {
      item.master = cnIsArray(item.master) && item.master[0] || { fullname: '未知', id: '' };
      item.lessonImage = cnIsArray(item.overviewfiles) && item.overviewfiles.length > 0 ? item.overviewfiles[0].fileurl : '';
    });
    return list;
  };

const getMenus = (str) => {
  const arr = [];
  cnIsArray(str.split(',')) && str.split(',')
    .map(item => {
      arr.push(
        allModule.find(ev => ev.id === item)
      );
    });
  return arr;
};
export default modelExtend(model, {
  namespace: 'dashboard',
  state: {
    count: 0,
    taskList: [],
    taskAllList: [],
    refreshing: false,
    selectIndex: 0,
    sysNotice: 0,
    taskTop: 0,
    lessonTop: 0,
    payState: 2,
    menus: [
      {
        id: '0',
        icon: require('themes/images/grids/more.png'),
        text: '更多',
        path: 'modelManage'
      }
    ]
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, action }) => {

        if (pathname === '/dashboard' || pathname === '/' && bkIdentity()) {
          if (action === 'PUSH') {
            dispatch({
              type: 'updateState',
              payload: {
                taskTop: 0,
                lessonTop: 0
              }
            });
          }
          dispatch({
            type: 'queryCount'
          });
          dispatch({
            type: 'query'
          });
          dispatch({
            type: 'queryMenus'
          });
          dispatch({
            type: 'querySysNotice',
            payload: {
              nowPage: 1,
              pageSize: 10
            }
          });
          dispatch({
            type: 'queryPaymentState'
          });
        }
      });
    }
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
              refreshing: false
            }
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
            refreshing: false
          }
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
            count: messageCount
          }
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
            sysNotice: data.data[0]
          }
        });
      } else {

      }
    },
    * queryMenus ({ payload }, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: {
          menus: [{
            id: '0',
            icon: require('themes/images/grids/more.png'),
            text: '更多',
            path: 'modelManage'
          }]
        }
      });
      const { menus } = yield select(_ => _.dashboard);
      const { success, data, message = '请稍后再试' } = yield call(queryMenus, { userId: _cg(userid) });
      if (success) {
        _cs(`menu_${_cg(userid)}`, data.userConfig);
        yield put({
          type: 'updateState',
          payload: {
            menus: [...getMenus(data.userConfig), ...menus]
          }
        });
      } else {
        Toast.fail(message);
      }
    },

    * queryPaymentState ({ payload }, { call, put }) {
      const { code, message = '获取信息失败', data } = yield call(queryPaymentState, payload);
      if (code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            payState: data
          }
        });
      } else {
        Toast.fail(message);
      }
    }
  }
});
