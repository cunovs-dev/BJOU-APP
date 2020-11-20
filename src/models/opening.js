import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { Toast } from 'components';
import { queryOpeningLessons } from 'services/lesson';

const namespace = 'opening',
  adapter = (list) => {
    cnIsArray(list) && list.map((item, i) => {
      item.master = cnIsArray(item.master) && item.master[0] || { fullname: '未知', id: '' };
      item.lessonImage = cnIsArray(item.overviewfiles) && item.overviewfiles.length > 0 ? item.overviewfiles[0].fileurl : '';
    });
    return list;
  };
export default modelExtend(model, {
  namespace,
  state: {
    list: [],
    refreshing: false,
    scrollerTop: 0
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, action }) => {
        if (pathname === `/${namespace}`) {
          if (action === 'PUSH') {
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
        }
      });
    }
  },
  effects: {
    * queryList ({ payload }, { call, put, select }) {
      const { users: { userid }, courseid } = yield select(_ => _.app),
        { success, message = '获取失败', data } = yield call(queryOpeningLessons, { userid, value: courseid });
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            list: adapter(data),
            refreshing: false
          }
        });
      } else {
        Toast.fail(message);
      }
    }
  }
});
