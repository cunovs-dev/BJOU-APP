import { routerRedux } from 'dva/router';
import {
  login,
  authentication,
  portalLogin,
  queryPortalToken,
  sendPhoneLoginCode,
  queryLoginTips,
  queryCaptchaImg,
  queryLastIdentity,
  setLastIdentity
} from 'services/login';
import { queryUserInfo, queryFiles, queryMoodleToken, checkFirstLogin } from 'services/app';
import { sendCode } from 'services/setup';
import { Toast } from 'antd-mobile';
import modelExtend from 'dva-model-extend';
import CryptoJS from 'crypto-js';
import { setLoginIn, setSession, config, cookie } from 'utils';
import md5 from 'md5';
import { pageModel } from './common';

const { userTag: { bkStudentNumber, portalToken, userLoginId, userloginname } } = config,
  { _cg } = cookie;
const encrypt = (word) => {
  return CryptoJS.SHA1(word)
    .toString();
};

const encryptMd5 = (word) => {
  return md5(word, 'hex');
};

export default modelExtend(pageModel, {
  namespace: 'login',

  state: {
    state: true,
    loadPwd: '',
    buttonState: true, // 登录按钮状态
    isDoubleTake: false,
    content: '',
    captchaImg: ''
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname.startsWith('/login')) {
          dispatch({
            type: 'updateState',
            payload: {
              state: true,
              loadPwd: '',
              content: '',
              buttonState: true,
              captchaImg: '',
              isDoubleTake: false
            }
          });
        }
      });
    }
  },
  effects: {
    * authentication ({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          buttonState: false
        }
      });
      const { password = '', username: userloginname } = payload;
      const { data, message = '请稍后再试', code } = yield call(authentication, {
        ...payload,
        username: userloginname,
        password: encrypt(password),
        systemType: cnDeviceType()
      }, true);
      if (code === 0) {
        setSession({ userloginname });
        const { loginId = '', secret = '' } = data;
        yield put({
          type: 'portalLogin',
          payload: {
            username: loginId,
            password: secret,
            systemType: cnDeviceType()
          }
        });
      } else if (code === -2) {
        yield put({
          type: 'queryCaptchaImg',
          payload: {
            capatcaKey: userloginname
          }
        });
        yield put({
          type: 'updateState',
          payload: {
            buttonState: true
          }
        });
        Toast.fail(message);
      } else {
        yield put({
          type: 'updateState',
          payload: {
            buttonState: true
          }
        });
        Toast.fail(message);
      }
    },

    * sendPhoneLoginCode ({ payload }, { call, put }) {
      const { data, message = '请稍后再试', code } = yield call(sendPhoneLoginCode, payload);
      if (code === 0) {

      } else {
        Toast.fail(message);
      }
    },

    * phoneLogin ({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          buttonState: false
        }
      });
      const { data, message = '请稍后再试', code } = yield call(authentication, {
        username: payload.phone,
        password: encrypt(payload.code),
        loginMode: 'SmsLogin'
      }, true);
      if (code === 0) {
        const { loginId = '', secret = '' } = data;
        yield put({
          type: 'portalLogin',
          payload: {
            username: loginId,
            password: secret
          }
        });
      } else {
        yield put({
          type: 'updateState',
          payload: {
            buttonState: true
          }
        });
        Toast.fail(message);
      }
    },

    * portalLogin ({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          buttonState: false
        }
      });
      const { code, data, message = '请稍后再试' } = yield call(portalLogin, payload, true);
      if (code === 0) {
        setSession({ userLoginId: data });
        yield put({
          type: 'queryPortalToken'
        });
      } else {
        yield put({
          type: 'updateState',
          payload: {
            buttonState: true
          }
        });
        Toast.fail(message);
      }
    },

    * queryPortalToken (_, { call, put }) {
      const { data, code, message = '获取token失败' } = yield call(queryPortalToken);
      if (code === 0) {
        setSession({ portalToken: data || '' });
        yield put({
          type: 'queryUserInfo',
          payload: {
            systemType: cnDeviceType()
          }
        });
      } else {
        yield put({
          type: 'updateState',
          payload: {
            buttonState: true
          }
        });
        Toast.fail(message);
      }
    },

    * checkFirstLogin ({ payload }, { call, put }) {
      const { access_token = '', orgCode = '' } = payload;
      const { data = {}, code, message = '请稍后再试' } = yield call(checkFirstLogin, { access_token });
      if (code === 0) {
        const { firstLogin, userId } = data;
        setSession({ portalUserId: userId });
        if (firstLogin) {
          yield put(routerRedux.push({
            pathname: 'firstLogin',
            query: {
              userId
            }
          }));
        } else {
          yield put(routerRedux.push({
            pathname: '/',
            query: {
              orgCode
            }
          }));
        }
      } else {
        Toast.fail(message);
      }
    },

    * queryMoodleToken ({ payload }, { call, put }) {
      const data = yield call(queryMoodleToken, {
        username: _cg(bkStudentNumber) || (_cg(userLoginId).length >= 11 ? _cg(userloginname) : _cg(userLoginId)), // 由于测试账号没有学号，保证测试账号能登录
        usersn: encryptMd5(`${_cg(bkStudentNumber) || (_cg(userLoginId).length >= 11 ? _cg(userloginname) : _cg(userLoginId))}f3c28dd72e61f16e173a353405af1fbd`)
      });
      if (data.success) {
        const { id: moodleUserId = '', token = '' } = data,
          users = {
            user_token: token,
            user_id: moodleUserId
          };
        setLoginIn(users);
        setSession({ orgCode: 'bjou_student' });
        yield put({
          type: 'checkFirstLogin',
          payload: {
            access_token: _cg(portalToken) || '',
            orgCode: 'bjou_student'
          }
        });
      } else {
        Toast.fail(data.message || '查询信息失败');
      }
    },

    * sendCode ({ payload }, { call, put }) {
      const { data = [], code, message = '请稍后再试' } = yield call(sendCode, payload);
      if (code === 0) {

      } else {
        Toast.fail(message);
      }
    },

    * queryUserInfo ({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          buttonState: true
        }
      });
      const { data = {}, code, message = '请稍后再试' } = yield call(queryUserInfo, payload, true);
      if (code === 0) {
        const { orgList = [], userId = '', userName = '', headImg, studentNumber = '' } = data;
        const infos = {
          portalUserId: userId,
          portalUserName: userName,
          username: userName,
          portalHeadImg: headImg,
          bkStudentNumber: studentNumber
        };
        setSession(infos);
        if (orgList.length > 1) {
          yield put({
            type: 'updateState',
            payload: {
              isDoubleTake: true
            }
          });
          setSession({ doubleTake: true });
        } else if (orgList.length === 1) {

          if (orgList[0].orgCode === 'bjou_student') {
            yield put({
              type: 'queryMoodleToken'
            });
            setSession({ orgCode: orgList[0].orgCode });
          } else {
            setSession({ orgCode: orgList[0].orgCode });
            yield put({
              type: 'checkFirstLogin',
              payload: {
                access_token: _cg(portalToken) || '',
                orgCode: orgList[0].orgCode
              }
            });
          }
        }
      } else {
        yield put({
          type: 'updateState',
          payload: {
            buttonState: true
          }
        });
        Toast.fail(message);
      }
    },
    * queryFiles ({ payload }, { call, put }) {
      const { data, code, message = '请稍后再试' } = yield call(queryFiles, payload);
      if (code === 0) {

      } else {
        Toast.fail(message);
      }
    },
    * queryLoginTips ({ payload }, { call, put }) {
      const { data, success, message = '未知错误，请稍后再试。' } = yield call(queryLoginTips, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            content: data
          }
        });
      } else {
        Toast.fail(message);
      }
    },
    * queryCaptchaImg ({ payload }, { call, put }) {

      const { data, success, message = '验证码获取失败' } = yield call(queryCaptchaImg, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            captchaImg: data
          }
        });
      } else {
        Toast.fail(message);
      }
    },
    * queryLastIdentity ({ payload }, { call, put }) {
      const { data, success, message = '验证码获取失败' } = yield call(queryLastIdentity, payload);
      if (success) {

      } else {
        Toast.fail(message);
      }
    },
    * setLastIdentity ({ payload }, { call, put }) {
      const { data, success, message = '验证码获取失败' } = yield call(setLastIdentity, payload);
      if (success) {

      } else {
        Toast.fail(message);
      }
    }
  }
});
