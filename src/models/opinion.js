import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { sendOpinion, sendOpinionFiles } from 'services/app';
import { routerRedux } from 'dva/router';
import { bkIdentity, oldAPP } from 'utils';
import { Toast } from 'components';

export default modelExtend(model, {
  namespace: 'opinion',
  state: {
    submitAnnex: ''
  },
  effects: {
    * sendOpinion ({ payload }, { call, put, select }) {
      const { users: { userid, username, userLoginId = '' } } = yield select(_ => _.app),
        { success, msg } = yield call(sendOpinion, {
          ...payload,
          userid: bkIdentity() || oldAPP() ? userid : userLoginId,
          submitUserName: username,
          submitDeviceInfo: JSON.stringify(cnDeviceInfo())
        });
      if (success) {
        yield put(routerRedux.replace({
          pathname: '/myopinion'
        }));
        Toast.success(msg || '感谢您的宝贵意见', 2);
      } else {
        Toast.fail(msg || '提交失败请稍后再试', 2);
      }
    },
    * sendOpinionFiles ({ payload }, { call, put, select }) {
      const { uploadKey, uploadFiles, ...others } = payload;
      let formData = new FormData();
      formData.append('formNames', uploadKey);
      Object.keys(uploadFiles)
        .map((key) => {
          const f = uploadFiles[key];
          formData.append(key, f, f.name);
        });
      const { msg = '感谢您的宝贵意见', success, data } = yield call(sendOpinionFiles, formData);
      if (success) {
        if (data !== '') {
          yield put({
            type: 'sendOpinion',
            payload: {
              ...others,
              submitAnnex: data
            }
          });
          yield put(routerRedux.replace({
            pathname: '/myopinion'
          }));
          Toast.success(msg, 2);
        } else {
          Toast.fail('文件上传失败');
        }
      } else {
        Toast.fail(msg || '文件上传失败');
      }
    }
  }
});
