import { routerRedux } from 'dva/router';
import { hashHistory } from 'react-router';
import { Toast } from 'components';
import { config, cookie, setLoginOut, setSession, bkIdentity, setLoginIn } from 'utils';
import { defaultTabBars } from 'utils/defaults';
import {
  queryBaseInfo,
  logout,
  accessTime,
  logApi,
  getVersion,
  queryPortalUser,
  queryMoodleToken
} from 'services/app';
import md5 from 'md5';

const encrypt = (word) => {
  return md5(word, 'hex');
};

const { userTag: { username, usertoken, userid, useravatar, portalToken, portalUserName, portalUserId, userloginname } } = config,
  { _cg } = cookie,
  getInfoUser = () => {
    const result = {};
    result[username] = _cg(username);
    result[usertoken] = _cg(usertoken);
    result[userid] = _cg(userid);
    result[useravatar] = _cg(useravatar);
    result[portalToken] = _cg(portalToken);
    result[portalUserId] = _cg(portalUserId);
    result[portalUserName] = _cg(portalUserName);
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
    showBackModal: false,
    downloadProgress: 0,
    tabsIcon: {}
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
          if (bkIdentity()) {
            dispatch({
              type: 'query',
              payload: {
                userid: others[userid],
                usertoken: others[usertoken]
              }
            });
          }
          dispatch({
            type: 'queryPortalUser',
            payload: {
              access_token: others.portalToken
            }
          });
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
        }
      });
    }
  },
  effects: {
    * query ({ payload }, { call, put }) {
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
              groups: getGroups(data.groups, data.courses),
              contacts: getContats(data.contacts),
              tabsIcon: data.tabsIcon || {},
              ...(data.appendConfig || {})
            }
          });
          yield put({
            type: 'userpage/updateState',
            payload: {
              contacts: getContats(data.contacts)
            }
          });
        } else {
          Toast.fail(data.message);
          /*          yield put(routerRedux.push({
                      pathname: '/login',
                    })); */
        }
      }
    },

    * queryPortalUser ({ payload }, { call, put }) {
      if (_cg(portalToken) === '' || !_cg(portalToken)) {
        yield put(routerRedux.push({
          pathname: '/login'
        }));
      } else {
        const { data, code, message = '个人信息获取失败' } = yield call(queryPortalUser);
        if (code === 0) {
          const { userId = '', userName = '' } = data;
          const infos = {
            portalUserId: userId,
            portalUserName: userName
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
            updates: data,
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
          Toast.fail('退出失败请稍后再试');
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
