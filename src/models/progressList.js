import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { Toast } from 'components';
import { queryProgressList } from 'services/list';


export default modelExtend(model, {
  namespace: 'progressList',
  state: {
    list: [],
    refreshing: false,
    scrollerTop: 0,
    grade: 0,
    totalGrade: 0
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, action }) => {
        if (pathname === '/progressList' && action === 'PUSH') {
          dispatch({
            type: 'updateState',
            payload: {
              list: [],
              refreshing: false,
              scrollerTop: 0,
              grade: 0,
              totalGrade: 0
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
      const { code, message = '获取失败', data } = yield call(queryProgressList);
      if (code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            list: data.models,
            grade: data.creditsEarned || 0,
            totalGrade: data.sumCount || 0,
            refreshing: false
          }
        });
      } else {
        Toast.fail(message);
      }
    }

  }
});
