import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { getLocalIcon } from 'utils';
import { Toast } from 'components';
import { routerRedux } from 'dva/router';
import {
  getQuizText,
  getQuizInfo,
  choiceQuestion,
  matchQuestion,
  getTimes,
  shortanswerQusetion,
  essayQusetion
} from 'utils/analysis';
import { queryExamination, queryLastTimeExamination, sendQuiz, querySummary } from 'services/resource';
import commonMoadl from 'components/commonModal';
import { model } from 'models/common';

const getAnswer = (data = []) => {
  data && data.map(item => {
    item.html = getQuizText(item.html);
    if (item.type === 'multichoice' || item.type === 'truefalse' || item.type === 'multichoiceset') {
      item.choose = choiceQuestion(item.html);
    } else if (item.type === 'essay') {
      item.choose = essayQusetion(item.html);
    } else if (item.type === 'match') {
      item.choose = matchQuestion(item.html);
    } else if (item.type === 'shortanswer') {
      item.choose = shortanswerQusetion(item.html);
    }
    item.info = getQuizInfo(item.html, item.type);
    item.formulation = getTimes(item.html);
  });
  return data;
};
export default modelExtend(model, {
  namespace: 'quizDetails',
  state: {
    data: {},
    navigator: [],
    // info: {},
    answer: [],
    page: 0,
    navmethod: '',
    attemptid: '',
    timelimit: 0
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        if (pathname === '/quizDetails' && action === 'PUSH') {
          const { quizid, state, attemptid, page, navmethod = '', timelimit = 0 } = query;

          dispatch({
            type: 'updateState',
            payload: {
              navmethod,
              timelimit,
              data: {},
              navigator: [],
              info: {},
              answer: [],
              page: 0
            }
          });
          if (state !== 'inprogress') {
            dispatch({
              type: 'queryExamination',
              payload: {
                quizid
              }
            });
          } else {
            dispatch({
              type: 'updateState',
              payload: {
                attemptid,
                page: page * 1
              }
            });
            dispatch({
              type: 'queryLastTimeExamination',
              payload: {
                quizid,
                attemptid,
                page: page * 1
              }
            });
            dispatch({
              type: 'querySummary',
              payload: {
                attemptid
              }
            });
          }
        }
      });
    }
  },
  effects: {
    * queryExamination ({ payload }, { call, put }) {
      const data = yield call(queryExamination, payload);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            data,
            // info: getQuizInfo(data.questions[0].html, data.questions[0].type),
            answer: getAnswer(data.questions),
            attemptid: data.id
          }
        });
        yield put({
          type: 'querySummary',
          payload: {
            attemptid: data.id
          }
        });
      } else {
        yield put({ type: 'goBack' });
        Toast.fail(data.message || '获取失败');
      }
    },

    * queryLastTimeExamination ({ payload }, { call, put }) {
      const data = yield call(queryLastTimeExamination, payload);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            data,
            // info: getQuizInfo(data.questions[0].html, data.questions[0].type),
            answer: getAnswer(data.questions)
          }
        });
      } else {
        Toast.fail(data.message || '获取失败');
        if (data.errorcode === 'attemptalreadyclosed') {
          yield put({ type: 'goBack' });
        }
      }
    },

    * querySummary ({ payload }, { call, put }) {
      const data = yield call(querySummary, payload);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            navigator: data.questions
          }
        });
      } else {
        Toast.fail(data.message);
      }
    },

    * sendQuiz ({ payload }, { call, put, select }) {
      const { navmethod, timelimit } = yield select(_ => _.quizDetails);
      const { name = '', type, data: params, attemptid, timeup, quizid, finishattempt = 0 } = payload;
      const data = yield call(sendQuiz, { ...params, attemptid, timeup, finishattempt });
      if (data.success) {
        if (type === 'finish') {
          yield put(routerRedux.replace({
            pathname: '/quizComplete',
            query: {
              attemptid,
              name,
              quizid,
              navmethod,
              timelimit
            }
          }));
        }

        if (data.state === 'finished') { // 重置page
          yield put(routerRedux.replace({
            pathname: '/quizReview',
            query: {
              attemptid
            }
          }));
          yield put({
            type: 'updateState',
            payload: {
              data: {},
              navigator: [],
              info: {},
              answer: [],
              page: 0,
              navmethod: ''
            }
          });
        }
      } else {
        if (data.modalAlert) {
          commonMoadl(data.message || '提交失败,请稍后再试');
        } else {
          Toast.fail(data.message || '提交失败,请稍后再试');
        }
      }
    }
  },
  reducers: {
    updateVal (state, { payload }) {
      const { id, value } = payload,
        { answer } = state;
      answer.choose.map(item => {
        item.checked = item.id === id;
      });
      return {
        ...state,
        answer
      };
    },
    updateCheckVal (state, { payload }) {
      const { id } = payload,
        { answer } = state;
      const currentCheck = answer.choose.find(item => item.id === id).checked;
      answer.choose.find(item => item.id === id).checked = !currentCheck;
      return {
        ...state,
        answer
      };
    },
    updateTextVal (state, { payload }) {
      const { value } = payload,
        { answer } = state;
      answer.choose.value = value;
      return {
        ...state,
        answer
      };
    }
  }
});
