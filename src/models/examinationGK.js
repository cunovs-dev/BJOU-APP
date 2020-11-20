import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { queryExamList } from 'services/list';
import { model } from 'models/common';
import { Toast } from 'components';

export default modelExtend(model, {
  namespace: 'examinationGK',
  state: {
    list: [],
    allList: [],
    selectIndex: 0,
    isShow: false
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen(({ pathname, query }) => {
        if (pathname === '/examinationGK') {
          dispatch({
            type: 'queryList',
            payload: {
              examYear: new Date().getFullYear()
            }
          });
        }
      });
    }
  },
  effects: {
    * queryList ({ payload }, { call, put }) {

      const { code, data, message = '请稍后再试' } = yield call(queryExamList, payload);
      if (code === 0) {
        if (payload && payload.examYear) {
          yield put({
            type: 'updateState',
            payload: {
              list: data.examScoreList || []
            }
          });
        } else {
          yield put({
            type: 'updateState',
            payload: {
              allList: data.examScoreList || []
            }
          });
        }
      } else {
        Toast.fail(message);
      }
    }
  }
});
