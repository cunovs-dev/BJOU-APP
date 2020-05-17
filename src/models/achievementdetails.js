import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import * as queryList from 'services/list';
import { model } from 'models/common';

const getGradeItems = (arr = []) => {
  return arr.filter(item => item.itemType !== 'course');
};

export default modelExtend(model, {
  namespace: 'achievementdetails',
  state: {
    gradeItems: [],
    refreshing: false,
    scrollerTop: 0,
    graderaw: '',
    coursename: '',
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        if (pathname === '/achievementdetails') {
          const { courseid } = query;
          if (action === 'PUSH') {
            dispatch({
              type: 'updateState',
              payload: {
                gradeItems: [],
                graderaw: '',
                coursename: '',
                refreshing: false,
                scrollerTop: 0
              }
            });
            dispatch({
              type: 'query',
              payload: {
                courseid,
              },
            });
          }
        }
      });
    },
  },

  effects: {
    * query ({ payload }, { call, put, select }) {
      const { users: { userid } } = yield select(_ => _.app),
        response = yield call(queryList.queryGradeDetails, { userid, ...payload });
      if (response.success) {
        const { coursename, courseid, data, graderaw = '' } = response;
        yield put({
          type: 'updateState',
          payload: {
            coursename,
            courseid,
            gradeItems: getGradeItems(data),
            graderaw
          },
        });
      }
    },
  },
});
