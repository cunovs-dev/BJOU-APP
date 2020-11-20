import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { queryPage } from 'services/resource';
import { textToElement } from 'utils';
import { userTag } from 'utils/config';
import { Toast } from 'components';
import { _cg } from 'utils/cookie';


const { username, userid, userloginname, bkStudentNumber } = userTag,
  findNameByCourses = (course = [], id) => {
    let name = '';
    if (id && course.length) {
      const selectedCourse = course.filter(c => c.id == id);
      name = selectedCourse.length ? (selectedCourse[0] || {}).fullname : '';
    }
    return name || '';
  },
  getViewIamges = (text) => {
    const result = [];
    if (text) {
      const proxyEl = textToElement(text);
      Array.from(proxyEl.querySelectorAll('img[showIgnore="false"]'))
        .map(el => {
          result.push(el.getAttribute('src')
            .replace(':80/', '/'));
        })
      ;
      /*    const imgReg = /<img.*?(?:>|\/>)/gi,
            srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i,
            images = text.match(imgReg);
          images && images.map(image => {
            let imageSrc = image.match(srcReg);
            if (imageSrc && imageSrc[1]) {
              result.push(imageSrc[1].replace(':80/', '/'));
            }
          }); */
    }
    return result;
  };

export default modelExtend(model, {
  namespace: 'page',
  state: {
    data: () => ({}),
    isOpen: false,
    viewImages: [],
    viewImageIndex: -1,
    queryName: '',
    scrollerTop: 0
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        let { pathname, query = {}, action } = location;
        if (pathname.startsWith('/page')) {
          if (action === 'PUSH') {
            dispatch({
              type: 'updateState',
              payload: {
                isOpen: false,
                viewImages: [],
                viewImageIndex: -1,
                data: {},
                queryName: query.name || '',
                scrollerTop: 0
              }
            });
            dispatch({
              type: 'query',
              payload: {
                ...query
              }
            });
          }
        }
      });
    }
  },
  effects: {
    * query ({ payload }, { call, put, select }) {
      const { courseData = [] } = yield select(_ => _.app),
        { courseid = '', name = '' } = payload,
        coursename = findNameByCourses(courseData, courseid);
      const data = yield call(queryPage, {
          ...payload,
          coursename,
          ...{
            userid: _cg(userid),
            userfullname: _cg(username),
            username: _cg(bkStudentNumber) || _cg(userloginname)
          },
          devicetype: cnDeviceType(true)
        }),
        { content = '', success } = data,
        viewImages = getViewIamges(content);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            data,
            viewImages
          }
        });
      } else {
        Toast.fail(data.message || '请稍后再试');
        yield put({ type: 'goBack' });
      }
    }
  }
});
