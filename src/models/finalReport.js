import { parse } from 'qs';
import { model } from 'models/common';
import { Toast } from 'components';
import modelExtend from 'dva-model-extend';
import { getAttendance } from '../services/app';

const defaultList = [
  {
    id: 1,
    name: '潘达',
    role: '辅导教师',
    tel: '13503323532',
    email: '324325@153.com',
    state: 0
  }
];


export default modelExtend(model, {
  namespace: 'finalReport',
  state: {
    listData: {},
    refreshing: false,
    scrollTop: 0
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        const { courseid = '' } = query;
        if (pathname === '/finalReport') {
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
          listData: defaultList
        }
      });
    }
  }
});
