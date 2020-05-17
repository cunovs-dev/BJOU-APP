import { parse } from 'qs';
import { model } from 'models/common';
import { Toast } from 'components';
import modelExtend from 'dva-model-extend';
import { getAttendance } from '../services/app';

const defaultData = [
  {
    name: '彭加木',
    state: 0,
    studentId: '34232132',
    absent: '6',
    attendance: '8'
  }
];
const getDefaultPaginations = () => ({
  nowPage: 1,
  rowCount: 10
});

export default modelExtend(model, {
  namespace: 'attendanceReport',
  state: {
    listData: [],
    scrollerTop: 0,
    paginations: getDefaultPaginations(),
    hasMore: true
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        const { courseid = '' } = query;
        if (pathname === '/attendanceReport') {
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
      //       data
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
