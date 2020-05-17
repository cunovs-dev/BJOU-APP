import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { getLocalIcon } from 'utils';
import { queryQuiz } from 'services/resource';
import { model } from 'models/common';
import { Toast } from 'components';

const getInfo = (arr) => {
  const res = {};
  if (cnIsArray(arr) && arr.length > 0) {
    const obj = arr[arr.length - 1];
    res.state = obj.state;
    res.attemptid = obj.id;
    res.page = obj.currentpage;
    return res;
  }
};

export default modelExtend(model, {
  namespace: 'quiz',
  state: {
    data: {},
    info: {},
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        if (pathname === '/quiz') {

        }
      });
    },
  },
  effects: {
    * queryQuiz ({ payload }, { call, put, select }) {
      const { users: { userid } } = yield select(_ => _.app);
      const data = yield call(queryQuiz, { ...payload, userid });
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            data,
            info: getInfo(data.attempts),
          },
        });
      } else {
        yield put({ type: 'goBack' });
        Toast.fail(data.message || '加载失败');
      }
    },
  },
});
