import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { Toast } from 'components';
import { bkIdentity, setSession } from 'utils';
import { queryNoticeList } from 'services/list';
import { queryStudentInfo, queryCurrentUser, changeCode } from 'services/app';

export default modelExtend(model, {
  namespace: 'dashboardGK',
  state: {
    list: [],
    refreshing: false,
    scrollerTop: 0,
    infoGK: {},
    studentIds: [],
    currentId: ''
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, action }) => {
        if (pathname === '/' && !bkIdentity()) {
          if (action === 'PUSH') {
            dispatch({
              type: 'updateState',
              payload: {
                scrollerTop: 0,
                infoGK: {},
              }
            });
          }
          dispatch({
            type: 'queryList',
            payload: {
              categoryId: 'gktzgg'
            }
          });
          dispatch({
            type: 'queryInfoGK'
          });
          dispatch({
            type: 'queryCurrentUser'
          });
        }
      });
    }
  },
  effects: {
    * queryList ({ payload }, { call, put }) {
      const { code, message = '获取失败', data } = yield call(queryNoticeList, { params: { ...payload } });
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
    },
    * queryCurrentUser ({ payload }, { call, put }) {
      const { data: { gkUserCodeCurrent = '', gkUserCode = '' }, code, message = '请稍后再试' } = yield call(queryCurrentUser, payload);
      if (code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            currentId: gkUserCodeCurrent,
            studentIds: gkUserCode.split(',')
          }
        });
      } else {
        Toast.fail(message);
      }
    },
    * queryInfoGK ({ payload }, { call, put }) {
      const { data = [], code, message = '请稍后再试' } = yield call(queryStudentInfo, payload);
      if (code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            infoGK: cnIsArray(data) ? data[0] : {}
          }
        });
        if (cnIsArray(data) && data[0]) {
          const { headImg = '' } = data[0];
          setSession({ portalHeadImgGK: headImg });
        }
      } else {
        Toast.fail(message);
      }
    },
    * changeCode ({ payload }, { call, put }) {
      const { code, message = '请稍后再试' } = yield call(changeCode, payload);
      if (code === 0) {
        yield put({
          type: 'queryCurrentUser'
        });
      } else {
        Toast.fail(message);
      }
    }
  }
});
