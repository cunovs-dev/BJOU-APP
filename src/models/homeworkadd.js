import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { UploadFile } from 'services/forum';
import { addHomeWork } from 'services/resource';
import { model } from 'models/common';
import { userTag, api as configApis } from 'utils/config';
import { _cg } from 'utils/cookie';
import commonMoadl from 'components/commonModal';
import { Toast } from 'components';

const { usertoken } = userTag,
  localUploadFile = (uploadFile, params = {}) => new Promise((resolve, reject) => {
    const onSuccess = (res) => resolve({ success: true, response: res }),
      onError = (err) => resolve({ success: false, response: err }),
      curToken = _cg(usertoken);
    const { fileName = '', fileurl = '', filenamePrefix = '', type = '' } = uploadFile;
    cnGetOrDownAndUploadFile(configApis.UploadFiles(), {
      fileName,
      filenamePrefix,
      fileUrl: `${fileurl}?token=${curToken}`,
      mimeType: type
    }, {
      ...params,
      token: curToken
    }, onSuccess, onError);
  });

export default modelExtend(model, {
  namespace: 'homeworkadd',
  state: {
    itemid: 0,
    animating: false
  },
  effects: {
    * uploadFile ({ payload }, { call, put, select }) {
      const { fileList = [], value = {} } = payload;
      let isContinue = true;
      for (let i = 0; isContinue && i < fileList.length; i++) {
        const uploadFile = fileList[i];
        const { itemid = 0 } = yield select(_ => _.homeworkadd);
        let currentItemid = '',
          errorMsg = '';
        if (!uploadFile.fileName && uploadFile.name) {
          let formData = new FormData();
          formData.append('file', uploadFile);
          formData.append('token', _cg(usertoken));
          formData.append('itemid', itemid);
          formData.append('filearea', 'draft');
          const result = yield call(UploadFile, formData);
          if (result && result[0]) {
            currentItemid = result[0].itemid || '';
          } else {
            errorMsg = result.error;
          }
        } else if (uploadFile.fileName) {
          const { success, ...otherResult } = yield call(localUploadFile, uploadFile, { itemid, filearea: 'draft' });
          if (success === true) {
            const { response = [] } = otherResult,
              responseData = response.length > 0 ? response[0] : {};
            if (responseData.hasOwnProperty('itemid')) {
              currentItemid = responseData.itemid;
            } else if (responseData.hasOwnProperty('error')) {
              errorMsg = responseData.error;
            }
          } else {
            errorMsg = otherResult.error || (otherResult.response && otherResult.response.message);
          }
        }
        if (currentItemid !== '') {
          yield put({
            type: 'updateState',
            payload: {
              itemid: currentItemid
            }
          });
        } else {
          yield put({
            type: 'updateState',
            payload: {
              animating: false
            }
          });
          Toast.fail(errorMsg || '上传附件时，发声未知错误，请稍候重试。');
          isContinue = false;
        }
        if (isContinue && i === fileList.length - 1) {
          yield put({
            type: 'addHomework',
            payload: {
              ...value,
              filemanager: currentItemid
            }
          });
        }
      }
    },
    * addHomework ({ payload, cb }, { call, put }) {
      const { success, message = '上传附件失败', modalAlert = false } = yield call(addHomeWork, payload);
      if (success) {
        yield put({ type: 'goBack' });
        Toast.success('保存成功');
        yield put({
          type: 'updateState',
          payload: {
            animating: false,
            itemid: 0
          }
        });
      } else {
        yield put({
          type: 'updateState',
          payload: {
            animating: false,
            itemid: 0
          }
        });
        modalAlert ? commonMoadl(message) : Toast.fail(message);
      }
    }
    ,
  }
})
;
