import modelExtend from 'dva-model-extend';
import { model } from 'models/common';

const bannerDatas = ['React.js', '面试', '算法', 'Vue.js', 'Python', '人工智能', 'GO语言', '小程序'];

export default modelExtend(model, {
  namespace: 'search',
  state: {
    banner: []
  },
  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen(({ pathname, action, query }) => {
        if (pathname === '/search') {
		          dispatch({
		            type: 'query',
		          });					
        }
      });
    },
  },
  effects: {
	    * query ({ payload }, { call, put, select }) {
	      yield put({
	        type: 'updateState',
	        payload: {
	          banner: bannerDatas
	        }
	      });
	    },
  }
});
