import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { Toast } from 'components';
import { queryGetTimetable } from 'services/list';


export default modelExtend(model, {
  namespace: 'timetable',
  state: {
    list: [],
    refreshing: false,
    scrollerTop: 0
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, action }) => {
        if (pathname === '/timetable' && action === 'PUSH') {
          dispatch({
            type: 'updateState',
            payload: {
              list: [],
              refreshing: false,
              scrollerTop: 0
            }
          });
          dispatch({
            type: 'queryList'
          });
        }
      });
    }
  },

  effects: {
    * queryList ({ payload }, { call, put }) {
      const { code, message = '获取信息失败', data } = yield call(queryGetTimetable);
      if (code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            list: data,
            refreshing: false
          }
        });
      } else {
        Toast.fail(message);
      }
    }

  }
});
