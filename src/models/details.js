import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { queryAppealDetail, readAppeal } from 'services/app';
import { model } from 'models/common';

import { routerRedux } from 'dva/router';
import { Toast } from 'components';

export default modelExtend(model, {
  namespace: 'details',
  state: {},
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen(({ pathname, query }) => {
        const { noticeId } = query;
        if (pathname === '/details') {
          if (noticeId) {
            dispatch({
              type: 'readAppeal',
              payload: {
                noticeId
              }
            });
          }
        }
      });
    },
  },
  effects: {
    * readAppeal ({ payload }, { call, put }) {
      yield call(readAppeal, payload);
    },
  }
});
