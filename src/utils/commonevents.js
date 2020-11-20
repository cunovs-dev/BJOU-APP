import { routerRedux } from 'dva/router';
import { Modal, Toast } from 'components';
import { resource } from 'utils/defaults';
import { doDecode, cookie, config, userToken, downLoadFile, renderSize } from 'utils';

const { userTag: { userid, usertoken }, api: { downFiles } } = config,
  { _cg } = cookie;
const alert = Modal.alert;
const handlerLessonListClick = ({ id = '' }, dispatch) => {
  dispatch(routerRedux.push({
    pathname: '/lessondetails',
    query: {
      courseid: id,
      userid: _cg(userid)
    }
  }));
};
const handleGridClick = ({ route = '', text = '' }, dispatch) => {
  dispatch(routerRedux.push({
    pathname: `/${route}`,
    query: {
      name: `${text}`
    }
  }));
};
// id : 模块内id(cmid) , instance : 主键id  , name : 名称 , contents : 文件时才用到。
const handlerCourseClick = (params, courseid, dispatch) => {
  const { modname = '', modulename = '', name = '', id = '', instance = '', httpurl = '', contents = [{}] } = params,
    targets = {};
  let downloadProgress;
  if ((modname || modulename) === 'resource') {
    const {
      fileurl: fileUrl = '', mimetype: mimeType = '', filename: fileName = '', fileIdPrefix = '', filesize: fileSize = '', fileOpenCallback = () => {
      }
    } = contents[0];
    const downLoading = () => {
      cnGetOrDownAndOpenFile({
        fileName: `${fileIdPrefix !== '' ? fileIdPrefix : courseid}_${id}_${fileName}`,
        fileUrl: `${fileUrl}${fileUrl.indexOf('?') === -1 ? '?' : '&'}token=${userToken()}`,
        mimeType
      }, (e) => {
        downloadProgress();
        Toast.info('正在打开文件...');
      }, (error) => {
        downloadProgress();
        let msg = '';
        if (error.message) {
          msg = error.message;
        } else if (error.body) {
          msg = JSON.parse(error.body).error;
        }
        Toast.offline(msg || '发生未知错误。');
      });
    };
    downloadProgress = (text = 0) => {
      if (dispatch) {
        dispatch({
          type: 'app/updateState',
          payload: {
            downloadProgress: text
          }
        });
      } else {
        fileOpenCallback(text !== 0);
      }
    };
    if (dispatch && instance !== '') {
      dispatch({ // 文件更新状态
        type: 'lessondetails/updateCompleteStatus',
        payload: {
          resourceid: instance
        }
      });
    }
    if (fileUrl !== '') {
      if (/\.rar/.test(fileUrl)) {
        alert('压缩包文件', '当前文件在移动端可能无法解压，建议使用PC端下载并解压', [
          { text: '仍要下载',
            onPress: () => {
              downloadProgress('加载中...');
              downLoading();
            } },
          {
            text: '取消',
            onPress: () => console.log('cancel')
          }
        ]);
        return;
      }
      if (fileSize > 5242880) {
        alert('大文件', `当前文件共${renderSize(fileSize)},下载需消耗大量流量和时间，建议使用PC端下载`, [
          { text: '仍要下载',
            onPress: () => {
              downloadProgress('加载中...');
              downLoading();
            } },
          {
            text: '取消',
            onPress: () => console.log('cancel')
          }
        ]);
        return;
      }
      downloadProgress('加载中...');
      downLoading();
      return;
    }
  }
  switch ((modname || modulename)) {
    case 'page':
      targets.pathname = '/page';
      targets.param = {
        pageid: instance,
        modname: modname || modulename
      };
      break;
    case 'forum':
      targets.pathname = '/forum';
      targets.param = {
        forumid: instance,
        modname: modname || modulename
      };
      break;
    case 'quiz':
      targets.pathname = '/quiz';
      targets.param = {
        quizid: instance,
        modname: modname || modulename
      };
      break;
    case 'assign':
      targets.pathname = '/homework';
      targets.param = {
        assignId: instance,
        modname: modname || modulename
      };
      break;
    case 'resource':
      if (Object.keys(contents[0]).length > 0) {
        break;
      }
      targets.pathname = 'lessondetails/queryResource';
      targets.notRoute = true;
      targets.param = {
        dispatch,
        modname: modname || modulename
      };
      break;
    case 'url':
      if (downloadProgress) downloadProgress('加载中...');
      dispatch({
        type: 'lessondetails/updateUrlStatus',
        payload: {
          urlid: instance
        }
      });
      let { pathname: targetPathname = 'lessondetails/queryUrl' } = targets;
      targets.pathname = targetPathname;
      targets.notRoute = true;
      targets.param = {
        dispatch,
        modname: modname || modulename
      };
      break;
    case 'svp':
    case 'superclass':
      let regExps = [],
        { url: scUrl = '', name: scName = '', chapter_id: chapterid = '' } = params;
      targets.pathname = '/superclass';
      if (chapterid !== '') {
        targets.param = {
          chapterid,
          name: scName,
          modname: modname || modulename
        };
      } else if (scUrl && (regExps = /\\?ch=([^&]+)(?:.*)layout=([^&]+)/.exec(scUrl)) && regExps.length > 1) {
        targets.param = {
          ch: regExps[1],
          layout: regExps[2],
          name: scName,
          modname: modname || modulename
        };
      } else {
        delete targets.pathname;
        alert('无法显示此资源', '请使用网页版学习平台查看此资源。', [
          { text: '知道了', onPress: () => console.log('cancel') }
        ]);
        // Toast.offline(`因参数丢失，无法使用${(modname || modulename)}类型标签，请使用PC端打开。`);
      }
      break;
    case 'httpurl':
      cnOpen(httpurl);
      return;
    case 'feedback':
      targets.pathname = '/feedback';
      targets.param = {
        id: instance,
        modname: modname || modulename
      };
      break;
    case 'choice':
      targets.pathname = '/choice';
      targets.param = {
        voteId: instance,
        modname: modname || modulename
      };
      break;
    case 'label':
      if (params.href) {
        alert('不能查看此资源', `请先按要求完成【${name}】`, [
          { text: '知道了', onPress: () => console.log('cancel') }
        ]);
      }
      break;
    case 'folder':
      targets.pathname = '/folder';
      targets.param = {
        folderid: instance,
        courseid,
        modname: modname || modulename
      };
      break;
    case 'mdlres':
      const { coursewareID } = params;
      targets.pathname = '/courseware';
      targets.param = {
        coursewareID
      };
      break;
    case 'ouwiki':
      if ((modname || modulename) !== '') {
        alert('兼容性问题', '请使用网页版学习平台参与此活动。', [
          { text: '知道了', onPress: () => console.log('cancel') }
        ]);
        // Toast.offline(`暂不支持${(modname || modulename)}类型标签，请使用PC端打开。`);
      }
      break;
    default:
      if ((modname || modulename) !== '') {
        alert('无法显示此资源', '请使用网页版学习平台查看此资源。', [
          { text: '知道了', onPress: () => console.log('cancel') }
        ]);
        // Toast.offline(`暂不支持${(modname || modulename)}类型标签，请使用PC端打开。`);
      }
  }
  const { pathname = '', param = {}, notRoute = false } = targets;
  if (pathname !== '') {
    const payload = {
      name,
      cmid: id,
      courseid,
      instance,
      ...param
    };
    if (notRoute === true) {
      dispatch({
        type: pathname,
        payload,
        cb: downloadProgress
      });
    } else {
      dispatch(routerRedux.push({
        pathname,
        query: payload
      }));
    }
  }
};

const handlerGradeItemClick = ({ itemType = '', name = '', id = '', courseid = '', instance = '' }, dispatch) => {
  handlerCourseClick({ modulename: itemType, id, instance }, courseid, dispatch);
};

const handlerTagAHrefParseParam = (params, courseid, dispatch) => {
  const { modname = '' } = params;
  if (modname !== '') {
    let targetParams = '';
    if (modname === 'resource') {
      const {
        fileurl = '', mimetype = '', filename = '', fileIdPrefix = '', href = '', id = '', callback: fileOpenCallback = () => {
        }, ...otherParams
      } = params;
      if (id === '' && (fileurl !== '' || filename !== '')) {
        targetParams = {
          contents: [{
            fileurl: fileurl || href, mimetype, filename, fileIdPrefix, fileOpenCallback
          }],
          ...otherParams
        };
      }
    }
    handlerCourseClick(targetParams !== '' ? targetParams : params, courseid, dispatch);
  } else {
    Toast.offline('需要查看的标签类型不能为空。');
  }
};

const handleElementTagAClick = (el, courseId = '', dispatch) => {
  let hrefParam = el.getAttribute('hrefParam'),
    notHasError = false;
  if (hrefParam) {
    let params = JSON.parse(hrefParam),
      { href = '' } = params;
    if ((notHasError = (href && courseId)) !== '') {
      handlerTagAHrefParseParam(params, courseId, dispatch);
    }
  }
  if (!!hrefParam && !notHasError) {
    alert('无法显示此资源', '请使用网页版学习平台查看此资源。', [
      { text: '知道了', onPress: () => console.log('cancel') }
    ]);
    // Toast.offline(`${courseId !== '' ? '标签解析失败' : '未能查找到课程'}，请使用PC端打开。`);
  }
};

const handlerDivInnerHTMLClick = (e, courseId, dispatch) => {
  switch (e.target.tagName) {
    case 'A':
      handleElementTagAClick(e.target, courseId, dispatch);
      break;
    default:
      if (e.target.hasAttribute('hrefParam') === true) {
        handleElementTagAClick(e.target, courseId, dispatch);
        break;
      }
      let targetEl = e.target.parentElement,
        counts = 0;
      do {
        if (targetEl.tagName === 'A') {
          break;
        }
        targetEl = targetEl.parentElement;
      } while (targetEl != null && counts++ < 5);

      if (targetEl != null && targetEl.tagName === 'A') {
        handleElementTagAClick(targetEl, courseId, dispatch);
      }
      break;
  }
};

const handlerChangeRouteClick = (path = '', data = {}, dispatch, e) => {
  e && e.stopPropagation();
  dispatch(routerRedux.push({
    pathname: `/${path}`,
    query: data
  }));
};
const handlerMessageClick = ({ type = 1, state, id, jumping, reason = '无法查看此通知, 请使用网页版学习平台查看此通知。' }, data = {}, dispatch, e) => {
  if (type === 1) {
    // dispatch(routerRedux.push({
    //   pathname: '/medalList',
    //   query: data,
    // }));
    alert(reason);
  } else if (type === 2 && jumping) {
    dispatch(routerRedux.push({
      pathname: '/homework',
      query: data
    }));
  } else if (jumping === false) {
    alert(reason);
  }
  if (state === 'unread') {
    dispatch({
      type: 'messageCenter/readNotice',
      payload: {
        messageids: id
      }
    });
  }
};
const repalceLoaclFileName = (srcName, targetName) => {
  if (cnIsDefined(srcName) && cnIsDefined(targetName)) {
    return srcName.replace(/.+?\.([^\.]+?)$/, `${targetName}.$1`);
  }
  return srcName;
};

const handlerPortalNoticeClick = (item, dispatch, e) => {
  e && e.stopPropagation();
  const { informationType, informationId, informationUrl, fileList = {}, categoryName } = item;
  if (informationType === 3) {
    cnOpen(informationUrl);
  } else {
    dispatch(routerRedux.push({
      pathname: '/systemDetails',
      query: {
        categoryName,
        informationId,
        informationType
      }
    }));
  }
};

module.exports = {
  handlerCourseClick,
  handlerLessonListClick,
  handlerGradeItemClick,
  handlerMessageClick,
  handleGridClick,
  handlerChangeRouteClick,
  handlerDivInnerHTMLClick,
  handleElementTagAClick,
  handlerTagAHrefParseParam,
  handlerPortalNoticeClick
};
