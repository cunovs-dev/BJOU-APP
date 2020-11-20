import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { config, cookie } from 'utils';
import { setAvatar, updateInfo } from 'services/setup';
import { routerRedux } from 'dva/router';
import { Toast } from 'antd-mobile';

const { _cs } = cookie,
  { userTag: { useravatar } } = config;

export default modelExtend(model, {
  namespace: 'oldSetup',
  state: {},
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        let { pathname } = location;
        if (pathname.startsWith('/oldSetup')) {

        }
      });
    },
  },

  effects: {
    * setAvatar ({ payload }, { call, put }) {
      const data = yield call(setAvatar, payload);
      if (data.success) {
        _cs(useravatar, data.profileimageurl);
        yield put({
          type: 'app/updateUsers',
          payload: {
            users: {
              useravatar: data.profileimageurl,
            },
          },
        });
        Toast.success('修改成功');
      } else {
        Toast.fail(data.message || '修改失败');
      }
    },
    * updateInfo ({ payload }, { call, put, select }) {
      const { users: { userid } } = yield select(_ => _.app),
        data = yield call(updateInfo, { ...payload, userid });
      if (data.success) {
        yield put({ type: 'goBack' });
        Toast.success('修改成功');
      } else {
        Toast.fail(data.msg || '修改失败');
      }
    },
  },

});
