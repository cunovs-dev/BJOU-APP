import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { getLocalIcon } from 'utils';
import { model } from 'models/common';
import { uploadRunningLogs } from 'services/app';
import { Toast } from 'components';

const defaultDatas = [
  {
    icon: require('../themes/images/others/teacher.jpg'),
    text: '我的老师',
    route: 'teachers'
  },
  {
    icon: require('../themes/images/others/group.jpg'),
    text: '我的小组',
    route: 'group'
  },
  {
    icon: require('../themes/images/others/achievement.jpg'),
    text: '我的成绩',
    route: 'achievement'
  }, {
    icon: require('../themes/images/others/attendance.jpg'),
    text: '我的考勤',
    route: 'attendance'
  }
];
export default modelExtend(model, {
  namespace: 'mine',
  state: {
    gridDatas: defaultDatas,
    localFileTotals: cnGetLocalFileSize(),
    clearProgress: 0,
    uploadState: false,
    showModal: false,
    dialog: {
      status: '建议立即下载资源升级APP',
      content: '',
      buttonText: '现在升级',
      statusCode: -1
    }
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        if (pathname === '/mine') {
          dispatch({
            type: 'updateState',
            payload: {
              localFileTotals: cnGetLocalFileSize(),
              clearProgress: 0,
              uploadLogState: false
            }
          });
        }
      });
    }

  },
  effects: {
    * uploadLogState ({ payload }, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: {
          uploadLogState: true
        }
      });
      const { msg = '无有效信息' } = payload, { users: { userid } } = yield select(_ => _.app),
        result = yield call(uploadRunningLogs, { msg, tags: userid });
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            uploadLogState: false
          }
        });
        Toast.success('提交成功。');
      }
    }
  }
});
