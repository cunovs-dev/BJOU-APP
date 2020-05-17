/* eslint-disable one-var */
import modelExtend from 'dva-model-extend';
import { routerRedux } from 'dva/router';

const model = {
    effects: {
      * goBack ({ payload }, { put }) {
        yield put(routerRedux.goBack());
      },
    },
    reducers: {
      updateState (state, { payload }) {
        return {
          ...state,
          ...payload,
        };
      },
    },
  },
  pageModel = modelExtend(model, {});
module.exports = {
  model,
  pageModel,
};
