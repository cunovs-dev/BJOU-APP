import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { getLocalIcon } from 'utils';
import { Toast } from 'components';
import { model } from 'models/common';
import { queryApplyList } from 'services/list';

const sortArray = (arr) => {
  const res = [],
    res1 = [],
    res2 = [],
    res3 = [];
  arr.map(item => {
    if (item.applyState === '审批中') {
      res1.push(item);
    } else if (item.applyState === '已完成') {
      res2.push(item);
    } else if (item.applyState === '未通过') {
      res3.push(item);
    } else {
      res.push(item);
    }
  });
  return res.concat(res1, res2, res3);
};
export default modelExtend(model, {
  namespace: 'apply',
  state: {
    list: []
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/apply') {
          dispatch({
            type: 'updateState',
            payload: {
              list: []
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
      const { code, message = '获取信息失败', data } = yield call(queryApplyList);
      if (code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            list: sortArray(data)
          }
        });
      } else {
        Toast.fail(message);
      }
    }
  }
});
