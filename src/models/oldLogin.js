import { routerRedux } from 'dva/router';
import { login } from 'services/login';
import { Toast } from 'antd-mobile';
import { JSEncrypt } from 'jsencrypt';
import modelExtend from 'dva-model-extend';
import { setOldLoginIn, setSession } from 'utils';
import { pageModel } from './common';

const encrypt = new JSEncrypt();
encrypt.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDCGpcIHHLBI5J94zYMJNpRZcbrPUa/6VvEDhcqR3mYMnOrlYXTCXFNNLarwj0+xG+aoo2OLfZagBSLZZtnaBXWhG1uVWOj6fZcvVD0oth3FiChsYn7nXU1nSTTh96cHQwnZ4gnLNuxYO4CZm9xeXhX98eYEChZ66ZjfKH1JypXDQIDAQAB');

export default modelExtend(pageModel, {
  namespace: 'oldLogin',
  state: {
    state: true,
    loadPwd: '',
    showModal: false,
    text: '请使用门户登录',
    buttonState: true // 登录按钮状态
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
      });
    }
  },
  effects: {
    * login ({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          buttonState: false
        }
      });
      const { password = '', username: userloginname } = payload;
      const data = yield call(login, { username: userloginname, password: encrypt.encrypt(password) }, true);
      yield put({
        type: 'updateState',
        payload: {
          buttonState: true
        }
      });
      if (data && data.success) {
        const { fullname = '', userid = '', token = '', userpictureurl = '' } = data,
          users = {
            user_name: fullname,
            user_pwd: password,
            user_token: token,
            user_id: userid,
            user_avatar: userpictureurl,
            user_login_name: userloginname
          };
        setSession({ oldAPP: true });
        setOldLoginIn(users);
        yield put({
          type: 'app/updateUsers',
          payload: {}
        });
        yield put(routerRedux.replace({
          pathname: '/'
        }));
      } else if (data && data.type === 'modal') {
        yield put({
          type: 'updateState',
          payload: {
            showModal: true,
            text: data.error
          }
        });
      } else {
        Toast.offline(data.error || '请稍后再试');
      }
    }
  }
});
