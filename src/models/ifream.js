import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';


export default modelExtend(model, {
  namespace: 'iframe',
  state: {
    externalUrl: '',
    htmlBody: '',
    name: '',
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        if (pathname === '/iframe') {
          const { externalUrl = '', name = '' } = query;
          dispatch({
            type: 'updateState',
            payload: {
              externalUrl,
              name,
            },
          });
          if (action === 'PUSH') {
            dispatch({
              type: 'query',
            });
          }
        }
      });
    },
  },
  effects: {
    * query ({ payload }, { call, put, select }) {
    
    },
  },
  reducers: {},
});
