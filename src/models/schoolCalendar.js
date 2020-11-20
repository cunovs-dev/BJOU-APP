import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { querySchoolCalendar, queryInformationGK, collection } from 'services/app';
import { model } from 'models/common';
import { bkIdentity } from 'utils';
import { routerRedux } from 'dva/router';
import { Toast } from 'components';

export default modelExtend(model, {
  namespace: 'schoolCalendar',
  state: {
    data: {}
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        if (pathname === '/schoolCalendar' && action === 'PUSH') {
          dispatch({
            type: 'updateState',
            payload: {
              data: {}
            }
          });
          const { queryType } = query;
          dispatch({
            type: 'query',
            payload: {
              cateGoryId: queryType
            }
          });
        }
      });
    }
  },
  effects: {
    * query ({ payload }, { call, put }) {
      const { code, message = '获取信息失败', data } = yield call(queryInformationGK, payload);
      if (code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            data
          }
        });
      } else {
        Toast.fail(message);
      }
    },
    * collection ({ payload }, { call, put }) {
      const { informationId = '', cateGoryId = '' } = payload;
      const { code, message = '获取失败' } = yield call(collection, { informationId });
      if (code === 0) {
        yield put({
          type: 'query',
          payload: {
            cateGoryId
          }
        });
      } else {
        Toast.fail(message);
      }
    }
  }
});
