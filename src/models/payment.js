import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { queryPaymentKey } from 'services/app';
import { routerRedux } from 'dva/router';
import { urlEncode, config } from 'utils';
import { Toast } from 'components';

const { api: { Payment } } = config;

const head = {
  'version': 'V1.0',
  'charset': 'UTF-8',
  'channel_id': urlEncode('202106180006'),
  'datetime': urlEncode(new Date().getTime()),
  'sign_type': 'SHA256WithRSA'
};

const param = {
  'user_code': '15210358661'
};

export default modelExtend(model, {
  namespace: 'payment',
  state: {},
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, action }) => {
        if (pathname === '/payment' && action === 'PUSH') {
          dispatch({
            type: 'queryPaymentKey',
            payload: {
              head: JSON.stringify(head),
              data: JSON.stringify(param)
            }
          });
        }
      });
    }
  },
  effects: {

    * queryPaymentKey ({ payload }, { call }) {
      // const blank = window.open('about:blank')
      const { success, sign, message = '请稍后再试' } = yield call(queryPaymentKey, payload);
      const { head: paramHead, data } = payload;
      if (success) {
        const url = `${Payment}?head=${paramHead}&data=${data}&sign=${sign}`;
       // blank.location=url
        cnOpen(url)
      } else {
        Toast.fail(message);
      }
    }
  }

});
