import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { config, cookie } from 'utils';
import { sendMenus } from 'services/app';
import { allModule } from 'utils/defaults';
import { routerRedux } from 'dva/router';
import { Toast } from 'components';

const { userTag: { userid } } = config,
  { _cg, _cs } = cookie;


const getMenus = (str) => {
  const arr = [];
  cnIsArray(str.split(',')) && str.split(',')
    .map(item => {
      arr.push(
        allModule.find(ev => ev.id === item)
      );
    });
  return arr || [];
};

const getChooseMenus = (str) => {
  const all = [];
  const current = str.split(',');
  allModule.map(item => all.push(item.id));
  for (let i = 0; i < current.length; i++) {
    for (let j = 0; j < all.length; j++) {
      if (all[j] === current[i]) {
        all.splice(j, 1);
        j -= 1;
      }
    }
  }
  return all.join(',');
};

export default modelExtend(model, {
  namespace: 'modelManage',
  state: {
    menus: [],
    chooseMenus: allModule
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, action }) => {
        if (pathname === '/modelManage' && action === 'PUSH') {
          dispatch({
            type: 'updateState',
            payload: {
              menus: [],
              chooseMenus: allModule
            }
          });
          dispatch({
            type: 'querys'
          });
        }
      });
    }
  },
  effects: {
    * sendMenus ({ payload, callback }, { call, put }) {
      const { success, message = '请稍后再试' } = yield call(sendMenus, { ...payload, userId: _cg(userid) });
      if (success) {
        _cs(`menu_${_cg(userid)}`, payload.userConfig);
        Toast.success('修改成功');
        if (callback) callback();
        yield put({
          type: 'updateState',
          payload: {
            chooseMenus: getMenus(getChooseMenus(payload.userConfig))
          }
        });
      } else {
        Toast.fail(message);
      }
    },
    * querys ({ payload }, { put }) {
      const selectedMenu = _cg(`menu_${_cg(userid)}`);
      yield put({
        type: 'updateState',
        payload: {
          menus: getMenus(selectedMenu),
          chooseMenus: getMenus(getChooseMenus(selectedMenu))
        }
      });
    }

  }

});
