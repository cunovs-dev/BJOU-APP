import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { getLocalIcon } from 'utils';
import { Toast } from 'components';
import { routerRedux } from 'dva/router';
import { querySummary } from 'services/resource';
import { model } from 'models/common';


export default modelExtend(model, {
  namespace: 'quizComplete',
  state: {
    questions: {},
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen(({ pathname, query }) => {
        if (pathname === '/quizComplete') {
          const { attemptid } = query;
          dispatch({
            type: 'querySummary',
            payload: {
              attemptid,
            },
          });
        }
      });
    },
  },
  effects: {
    * querySummary ({ payload }, { call, put }) {
      const data = yield call(querySummary, payload);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            data,
            questions: data.questions,
          },
        });
      } else if (data.errorcode === 'attemptalreadyclosed') {
        yield put({ type: 'goBack' });
      } else {
        Toast.fail(data.message);
      }
    },
  },

});
