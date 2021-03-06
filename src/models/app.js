import { routerRedux } from 'dva/router';
import { hashHistory } from 'react-router';
import { Toast } from 'components';
import { config, urlEncode, cookie, setLoginOut, setSession, bkIdentity, setLoginIn, oldAPP } from 'utils';
import { defaultTabBars } from 'utils/defaults';
import commonMoadl from 'components/commonModal';
import {
  queryBaseInfo,
  logout,
  accessTime,
  logApi,
  getVersion,
  queryPortalUser,
  queryMoodleToken,
  checkFirstLogin,
  queryPaymentKey
} from 'services/app';
import { pcLogin, queryPcPassword } from 'services/login';
import md5 from 'md5';

const encryptMd5 = (word) => {
  return md5(word, 'hex');
};
const { userTag: { username, usertoken, userid, useravatar, portalToken, portalUserName, portalUserId, userloginname, bkStudentNumber, userLoginId }, api: { Payment } } = config,
  { _cg } = cookie,
  head = {
    'version': 'V1.0',
    'charset': 'UTF-8',
    'channel_id': urlEncode('202106180006'),
    'datetime': urlEncode(new Date().getTime()),
    'sign_type': 'SHA256WithRSA'
  },
  param = {
    'user_code': _cg(bkStudentNumber) || _cg(userLoginId)
  },
  getInfoUser = () => {
    const result = {};
    result[username] = _cg(username);
    result[usertoken] = _cg(usertoken);
    result[userid] = _cg(userid);
    result[useravatar] = _cg(useravatar);
    result[portalToken] = _cg(portalToken);
    result[portalUserId] = _cg(portalUserId);
    result[portalUserName] = _cg(portalUserName);
    result[userloginname] = _cg(userloginname);
    result[userLoginId] = _cg(userLoginId);
    return result;
  },
  getUserLoginStatus = (users = '') => {
    users = users || getInfoUser();
    return (users[userid] !== '' && users[usertoken] !== '' && users[username] !== '') || (users[portalToken] !== '' && users[portalUserId] !== '' && users[portalUserName] !== '');
  },

  getCourse = (arr) => {
    let res = [];
    arr && arr.map(item => (
      res.push(item.id)
    ));
    return res.join(',');
  },
  getGroups = (arr = [], course) => {
    let obj = {};
    arr.map((item, i) => {
      obj = course.find(data => {
        return data.id === item.courseid;
      });
      item.course = obj.fullname;
    });
    return arr;
  },

  getContats = (obj = {}) => [...obj.online, ...obj.offline],
  removeLocalFile = (file) => new Promise(resolve => {
    const onSuccess = (res) => resolve({ success: true, response: res }),
      onError = (err) => resolve({ success: false, response: err });
    cnRemoveLocalFile(file.localURL, onSuccess, onError);
  });

export default {
  namespace: 'app',
  state: {
    spinning: false,
    isLogin: getUserLoginStatus(),
    users: getInfoUser(),
    courseid: '',
    courseData: [],
    updates: {},
    groups: [],
    contacts: [],
    courseIdNumbers: {},
    showBackModal: false,
    downloadProgress: 0,
    tabsIcon: {},
    _useJavaScriptMessage: {
      info: '?????????????????????????????????????????????????????????????????????????????????',
      warn: '???????????????????????????????????????????????????????????????????????????????????????????????????????????????'
    }
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      cnAppInit();
      history.listen(({ pathname, query }) => {
        if (pathname === '/') {
          const others = {};
          others[userid] = _cg(userid);
          others[usertoken] = _cg(usertoken);
          others[portalToken] = _cg(portalToken);
          if (bkIdentity() || oldAPP()) {
            dispatch({
              type: 'query',
              payload: {
                userid: others[userid],
                usertoken: others[usertoken]
              }
            });
          }
          if (others.usertoken !== '' || others.portalToken !== '') {
            dispatch({
              type: 'updateUsers'
            });
            dispatch({
              type: 'getVersion',
              payload: {
                currentVersion: cnVersion,
                systemType: cnDeviceType(),
                userId: others.userid,
                currentCodeVersion: cnCodeVersion
              }
            });
          }
          if (!oldAPP()) {
            dispatch({
              type: 'queryPortalUser',
              payload: {
                access_token: others.portalToken
              }
            });
          }
        }
      });
    }
  },
  effects: {

    * checkFirstLogin ({ payload }, { call, put }) {
      const { data = {}, code, message = '???????????????' } = yield call(checkFirstLogin, payload);
      if (code === 0) {
        const { firstLogin, userId } = data;
        setSession({ portalUserId: userId });
        if (firstLogin) {
          yield put(routerRedux.replace({
            pathname: 'firstLogin',
            query: {
              userId
            }
          }));
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
    query: function* ({ payload }, { call, put }) {
      if (_cg(usertoken) === '') {
        yield put(routerRedux.push({
          pathname: '/login'
        }));
      } else {
        const data = yield call(queryBaseInfo, payload);
        if (data.success) {
          // eslint-disable-next-line no-prototype-builtins
          cnExecFunction(data.hasOwnProperty('_configFunction') ? data._configFunction : '');
          yield put({
            type: 'updateState',
            payload: {
              courseid: getCourse(data.courses),
              courseData: data.courses,
              courseIdNumbers: data.courseIdNumbers,
              groups: getGroups(data.groups, data.courses),
              contacts: getContats(data.contacts),
              tabsIcon: data.tabsIcon || {},
              _useJavaScriptMessage: data._useJavaScriptMessage || {
                info: '?????????????????????????????????app??????????????????????????????????????????elearning.bjou.edu.cn???',
                warn: ':?????????????????????????????????????????????????????????????????????'
              },
              ...(data.appendConfig || {})
            }
          });
          // yield put({// ??????????????????
          //   type: `${!oldAPP() ? 'dashboard' : 'oldDashboard'}/query`
          // });
          yield put({
            type: 'userpage/updateState',
            payload: {
              contacts: getContats(data.contacts)
            }
          });
        } else if (data.modalAlert) {
          commonMoadl(data.message || '???????????????');
        } else {
          Toast.fail(data.message || '???????????????');
        }
      }
    },

    * queryPortalUser ({ payload }, { call, put }) {
      if (_cg(portalToken) === '' || !_cg(portalToken)) {
        yield put(routerRedux.push({
          pathname: '/login'
        }));
      } else {
        const { data, code, message = '????????????????????????' } = yield call(queryPortalUser, payload);
        if (code === 0) {
          const { userId = '', userName = '' } = data;
          const infos = {
            portalUserId: userId,
            portalUserName: userName,
            username: userName
          };
          setSession(infos);
        } else {
          Toast.fail(message);
        }
      }
    },

    * getVersion ({ payload }, { call, put, select }) {
      const data = yield call(getVersion, payload);
      const { urls = '' } = data;
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            updates: data || {},
            showModal: urls !== ''
          }
        });
      } else {
        Toast.fail(data.message);
        yield put(routerRedux.push({
          pathname: '/login'
        }));
      }
    },

    * logout ({}, { call, put, select }) {
      if (bkIdentity()) {
        const data = yield call(logout);
        if (data) {
          setLoginOut();
          yield put({
            type: 'updateState',
            payload: {
              users: {},
              isLogin: false
            }
          });
          yield put(routerRedux.replace({
            pathname: '/login'
          }));
        } else {
          Toast.fail('???????????????????????????');
        }
      } else {
        setLoginOut();
        yield put(routerRedux.replace({
          pathname: '/login'
        }));
      }
    },

    * accessTime ({ payload }, { call }) {
      yield call(accessTime, { ...payload, userid: _cg(userid) });
    },


    * logApi ({ payload }, { call }) {
      yield call(logApi, { ...payload, userid: _cg(userid) });
    },

    * removeAllLocalFiles ({ cb }, { call }) {
      const files = cnGetAllLocalFiles(),
        targetFiles = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i],
          result = yield call(removeLocalFile, file);
        if (!result.success) {
          targetFiles.push(file);
        }
      }
      cnSetAllLocalFiles(targetFiles);
      if (cb) cb();
    },
    * queryMoodleToken ({ payload }, { call, put }) {
      const data = yield call(queryMoodleToken, {
        username: _cg(bkStudentNumber) || (_cg(userLoginId).length >= 11 ? _cg(userloginname) : _cg(userLoginId)), // ????????????????????????????????????????????????????????????
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
        yield put(routerRedux.push({
          pathname: '/',
          query: {
            orgCode: 'bjou_student'
          }
        }));
      } else {
        Toast.fail(data.message || '??????????????????');
      }
    },
    // ??????????????????
    * queryPcPassword ({ payload }, { call, put }) {
      const { appType } = payload;
      const { data, message = '???????????????' } = yield call(queryPcPassword, { credential: 'XoBjou60!' });
      if (data) {
        yield put({
          type: 'pcLogin',
          payload: {
            username: _cg(bkStudentNumber),
            password: data,
            loginMode: 'PasswordLogin',
            appType
          }
        });
      } else {
        Toast.fail(message);
      }
    },
    * pcLogin ({ payload }, { call }) {
      const { appType } = payload;
      const { success } = yield call(pcLogin, payload);
      if (success) {
        cnOpen(appsUrl[appType]);
      }
    },

    // ??????????????????
    * queryPaymentKey (_, { call }) {
      // const blank = window.open('about:blank');
      const payload = {
        head: JSON.stringify(head),
        data: JSON.stringify(param)
      };
      const { success, sign, message = '???????????????' } = yield call(queryPaymentKey, payload);
      const { head: paramHead, data } = payload;
      if (success) {
        // const url = `${Payment}?head=${paramHead}&data=${data}&sign=${sign}`;
        const url = encodeURI(`${Payment}?head=${paramHead}&data=${data}&sign=${sign}`);
        // blank.location = url;
        cnOpen(url);
      } else {
        Toast.fail(message);
      }
    }
  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    updateUsers (state, { payload = {} }) {
      let { users: appendUsers = getInfoUser(), others = {} } = payload,
        { users } = state;
      users = { ...users, ...appendUsers };
      let isLogin = getUserLoginStatus(users);
      return {
        ...state,
        ...others,
        users,
        isLogin
      };
    },

    updateBackModal (state, { payload }) {
      return {
        ...state,
        showBackModal: payload.showBackModal
      };
    }

  }

};
