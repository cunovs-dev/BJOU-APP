import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import * as Service from 'services/resource';
import { routerRedux } from 'dva/router';
import * as type from 'utils/feedback';
import { Toast } from 'components';

const getQuestions = (arr) => {
  let result = [];
  arr && arr.map((item, i) => {
    switch (item.typ) {
      case 'label':
        result.push(type.getItemFormLabel(item));
        break;
      case 'info':
        result.push(type.getItemFormInfo(item));
        break;
      case 'numeric':
        result.push(type.getItemFormNumeric(item));
        break;
      case 'textfield':
        result.push(type.getItemFormTextfield(item));
        break;
      case 'textarea':
        result.push(type.getItemFormTextarea(item));
        break;
      case 'multichoice':
        result.push(type.getItemFormMultichoice(item));
        break;
      case 'multichoicerated':
        result.push(type.getItemFormMultichoice(item));
        break;
    }
  });
  return result;
};


export default modelExtend(model, {
  namespace: 'feedbackdetails',
  state: {
    questions: [],
    page: 0,
    hasprevpage: false,
    hasnextpage: true
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, action, query }) => {
        const { id = '' } = query;
        if (pathname === '/feedbackdetails' && action === 'PUSH') {
          dispatch({
            type: 'updateState',
            payload: {
              questions: [],
              page: 0,
              hasprevpage: false,
              hasnextpage: true
            }
          });
          dispatch({
            type: 'query',
            payload: {
              id,
            }
          });
        }
      });
    },
  },
  effects: {
    * query ({ payload }, { call, put, select }) {
      const { page } = yield select(_ => _.feedbackdetails);
      const { success, items, message = '请稍后再试', hasprevpage, hasnextpage } = yield call(Service.queryFeedbackQuestions, {
        ...payload,
        page
      });
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            questions: getQuestions(items),
            hasprevpage,
            hasnextpage
          }
        });
      } else {
        Toast.fail(message);
      }
    },
    * sendFeedBack ({ payload, callback }, { call, put, select }) {
      const { success, data, message = '请稍后再试' } = yield call(Service.sendFeedBack, payload);
      if (success) {
        callback && callback();
      } else {
        Toast.fail(message);
      }
    },
    * completeFeedBack ({ payload }, { call, put, select }) {
      const { success, data, message = '请稍后再试' } = yield call(Service.completeFeedBack, payload);
      if (success) {
        yield put({ type: 'goBack' });
        Toast.success('提交成功');
      } else {
        Toast.fail(message);
      }
    },
  },
  reducers: {
    updateVal (state, { payload }) {
      const { id, value } = payload,
        { questions } = state;
      const res = questions.find(item => item.id === id);
      res.value = value;
      res.responsevalue = value;
      const newData = [...questions];
      const index = newData.findIndex(item => item.id === id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...res,
        });
      }
      return {
        ...state,
        questions: newData,
      };
    },
    updateCheckVal (state, { payload }) {
      const { id, value } = payload,
        { questions } = state;
      const res = questions.find(item => item.id === id);
      const currentVal = res.responsevalue.split('|');
      if (currentVal.includes(value.toString())) {
        currentVal.remove(value.toString());
      } else {
        currentVal.push(value.toString());
      }
      const newData = [...questions];
      const index = newData.findIndex(item => item.id === id);
      res.choices.forEach((choice) => {
        for (const x in currentVal) {
          if (choice.value == currentVal[x]) {
            choice.checked = true;
            return;
          }
          choice.checked = false;
        }
      });
      res.responsevalue = currentVal.join('|');
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...res,
        });
      }
      return {
        ...state,
        questions: newData,
      };
    },
  }
});
