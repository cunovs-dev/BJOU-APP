import modelExtend from 'dva-model-extend';
import { queryReply, ReplyForum } from 'services/forum';
import { Toast } from 'components';
import { model } from 'models/common';

const getShowList = (nodeId, map, index = 0, counts = {}, num = 0) => {
  const result = map[nodeId];
  counts[nodeId] = 0;
  result.level = index;
  result.num = num;
  num++;
  index++;
  Object.keys(counts)
    .map(k => {
      counts[k] = ++counts[k];
    });
  if (result && result.children && result.children.length) {
    result.children = result.children.map(nId => getShowList(nId, map, index, counts, num++));
  }
  result.totalCounts = counts[nodeId];
  return result;
};

export default modelExtend(model, {
  namespace: 'forumDetails',
  state: {
    data: [],
    parent: {},
    replyList: [],
    refreshing: false,
    scrollerTop: 0,
  },
  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen(({ pathname, action, query }) => {
        if (action === 'PUSH') {
          dispatch({
            type: 'updateState',
            payload: {
              data: [],
              parent: {},
              replyList: [],
              refreshing: false,
              scrollerTop: 0,
            }
          });
        }
        if (pathname === '/forumDetails') {
          const { discussionid } = query;
          dispatch({
            type: 'query',
            payload: {
              discussionid
            }
          });
        }
      });
    },
  },
  effects: {
    * query ({ payload }, { call, put, select }) {
      const { success, message = '请稍后再试', posts = [], ratinginfo: { ratings = [] } } = yield call(queryReply, payload);
      if (success) {
        const postNodes = {},
          ratingNodes = {};
        let parentNode = { children: [] };
        ratings.map(rating => {
          const { itemid, ...others } = rating;
          ratingNodes[itemid] = others;
        });
        posts.map(post => {
          const postId = post.id;
          postNodes[postId] = Object.assign(post, ratingNodes[postId] || {});
          if (post.parent === 0) {
            parentNode = postNodes[postId];
          }
        });
        yield put({
          type: 'updateState',
          payload: {
            data: posts,
            parent: parentNode,
            replyList: parentNode.children && parentNode.children.length ? parentNode.children.map(nodeId => getShowList(nodeId, postNodes)) : [],
            refreshing: false
          }
        });
      } else {
        Toast.fail(message);
        yield put({
          type: 'updateState',
          payload: {
            refreshing: false
          }
        });
      }
    },
  }
});
