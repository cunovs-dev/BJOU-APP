import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { UploadFile, addNewForum, replyForum } from 'services/forum';
import { model } from 'models/common';
import { userTag } from 'utils/config';
import { _cg } from 'utils/cookie';
import commonMoadl from 'components/commonModal';
import { setRouterNeedRefresh } from 'utils';

import { routerRedux } from 'dva/router';
import { Toast } from 'components';

const { usertoken } = userTag;

export default modelExtend(model, {
  namespace: 'sendForum',
  state: {
    itemid: 0,
    type: 'add',
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        const { type } = query;
        if (pathname === '/sendForum') {
          dispatch({
            type: 'updateState',
            payload: {
              type,
              itemid: 0,
            }
          });
        }
      });
    },
  },
  effects: {
    * uploadFile ({ payload }, { call, put, select }) {
      const { fileList, value } = payload;
      let formData = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        const { itemid } = yield select(_ => _.sendForum);
        formData.append('file', fileList[i]);
        formData.append('token', _cg(usertoken));
        formData.append('itemid', itemid);
        formData.append('filearea', 'draft');
        const response = yield call(UploadFile, formData);
        formData = new FormData();
        if (response) {
          yield put({
            type: 'updateState',
            payload: {
              itemid: response[0].itemid
            }
          });
          if (i === fileList.length - 1) {
            yield put({
              type: 'AddNewForum',
              payload: {
                ...value,
                itemid: response[0].itemid
              }
            });
          }
        }
      }
    },
    * AddNewForum ({ payload }, { call, put, select }) {
      const { type } = yield select(_ => _.sendForum);

      if (type === 'add') {
        const { success, message = '发送失败', modalAlert = false } = yield call(addNewForum, payload);
        if (success) {
          yield setRouterNeedRefresh('forum');
          yield put({ type: 'goBack', query: { needRefresh: true } });
          Toast.success('提交成功');
        } else {
          modalAlert ? commonMoadl(message) : Toast.fail(message);
        }
      } else {
        const { success, message = '发送失败', modalAlert = false } = yield call(replyForum, payload);
        if (success) {
          yield put({ type: 'goBack' });
          Toast.success('提交成功');
        } else {
          modalAlert ? commonMoadl(message) : Toast.fail(message);
        }
      }
    },
  }
})
;
