import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { sendCodeWithToken, updatePhoneOrEmail } from 'services/setup';
import { Toast } from 'components';
import { routerRedux } from 'dva/router';
import { model } from 'models/common';

export default modelExtend(model, {
  namespace: 'setPhoneOrMail',
  state: {

  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        let { pathname, action } = location;
        if (pathname.startsWith('/setPhoneOrMail')) {

        }
      });
    }
  },
  effects: {
    * sendCodeWithToken ({ payload }, { call, put }) {
      const { data, code, message = '请稍后再试' } = yield call(sendCodeWithToken, payload);
      if (code === 0) {

      } else {
        Toast.fail(message);
      }
    },
    * updatePhoneOrEmail ({ payload }, { call, put }) {
      const { data, code, message = '请稍后再试' } = yield call(updatePhoneOrEmail, payload);
      if (code === 0) {
        yield put(routerRedux.replace({
          pathname: '/setup'
        }));
        Toast.success('修改成功');
      } else {
        Toast.fail(message);
      }
    }
  }

});
