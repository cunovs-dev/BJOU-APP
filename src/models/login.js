import { routerRedux } from 'dva/router';
import { login, authentication, portalLogin, queryPortalToken, sendPhoneLoginCode } from 'services/login';
import { queryUserInfo, queryFiles, queryMoodleToken } from 'services/app';
import { sendCode } from 'services/setup';
import { Toast } from 'antd-mobile';
import modelExtend from 'dva-model-extend';
import md5 from 'md5';
import { setLoginIn, setSession, config, cookie } from 'utils';
import { pageModel } from './common';

const { userTag: { userloginname } } = config,
  { _cg } = cookie;
const encrypt = (word) => {
  return md5(word, 'hex');
};

export default modelExtend(pageModel, {
  namespace: 'login',

  state: {
    state: true,
    loadPwd: '',
    buttonState: true, // 登录按钮状态
    isDoubleTake: false
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/login') {
          dispatch({
            type: 'updateState',
            payload: {
              state: true,
              loadPwd: '',
              buttonState: true,
              isDoubleTake: false
            }
          });
        }
      });
    }
  },
  effects: {
    // * login ({ payload }, { call, put }) {
    //   yield put({
    //     type: 'updateState',
    //     payload: {
    //       buttonState: false
    //     }
    //   });
    //   const { from = '/', password = '', username: userloginname } = payload;
    //   const data = yield call(login, payload, true);
    //   yield put({
    //     type: 'updateState',
    //     payload: {
    //       buttonState: true
    //     }
    //   });
    //   if (data && data.success) {
    //     const { fullname = '', userid = '', token = '', userpictureurl = '' } = data,
    //       users = {
    //         user_name: fullname,
    //         user_pwd: password,
    //         user_token: token,
    //         user_id: userid,
    //         user_avatar: userpictureurl,
    //         user_login_name: userloginname
    //       };
    //     setLoginIn(users);
    //     yield put({
    //       type: 'app/updateUsers',
    //       payload: {}
    //     });
    //     yield put(routerRedux.replace({
    //       pathname: from
    //     }));
    //   } else {
    //     Toast.offline(data.error);
    //   }
    // }

    * authentication ({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          buttonState: false
        }
      });
      const { password = '', username: userloginname } = payload;
      const { data, message = '请稍后再试', code } = yield call(authentication, {
        username: userloginname,
        password: encrypt(password)
      }, true);
      if (code === 0) {
        setSession({ userpwd: password });
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
        // setSession({ userloginname, userpwd: password });
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
        setSession({ userloginname: data });
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
        yield put({ // 判断用户类型
          type: 'queryUserInfo'
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

    * queryMoodleToken ({ payload }, { call, put }) {
      const data = yield call(queryMoodleToken, {
        username: _cg(userloginname),
        usersn: encrypt(`${_cg(userloginname)}f3c28dd72e61f16e173a353405af1fbd`)
      });
      if (data.success) {
        const { id: moodleUserId = '', token = '' } = data,
          users = {
            user_token: token,
            user_id: moodleUserId
          };
        setLoginIn(users);
        setSession({ orgCode: 'bjou_student' });
        yield put(routerRedux.push({
          pathname: '/',
          query: {
            orgCode: 'bjou_student'
          }
        }));
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
        const { orgList = [], userId = '', userName = '', headImg } = data;
        const infos = {
          portalUserId: userId,
          portalUserName: userName,
          portalHeadImg: headImg
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
            yield put(routerRedux.push({
              pathname: '/',
              query: {
                orgCode: orgList[0].orgCode
              }
            }));
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
    }
  }
});
