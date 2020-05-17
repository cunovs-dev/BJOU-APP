import { parse } from 'qs';
import { model } from 'models/common';
import { Toast } from 'components';
import modelExtend from 'dva-model-extend';
import { getAttendance } from '../services/app';

const defaultData = [
  {
    id: 1,
    name: '古巨基',
    grade: '78',
    studentId: '21242323',
  }
];

export default modelExtend(model, {
  namespace: 'memberAchievement',
  state: {
    listData: [],
    refreshing: false,
    scrollTop: 0
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        const { courseid = '' } = query;
        if (pathname === '/memberAchievement') {
          if (action === 'PUSH') {
            dispatch({
              type: 'updateState',
              payload: {
                data: {}
              }
            });
            dispatch({
              type: 'fetch',
              payload: {
                courseid
              }
            });
          }
        }
      });
    }
  },

  effects: {
    * fetch ({ payload }, { call, put, select }) {
      // const { users: { userid } } = yield select(_ => _.app),
      //   data = yield call(getAttendance, { ...payload, userid });
      // if (data.success) {
      //   yield put({
      //     type: 'updateState',
      //     payload: {
      //       data: data || {}
      //     }
      //   });
      // } else {
      //   Toast.fail(data.message || '获取失败');
      // }
      yield put({
        type: 'updateState',
        payload: {
          listData: defaultData
        }
      });
    }
  }
});
