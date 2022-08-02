import classnames from 'classnames';
import defaultImg from 'themes/images/default/default.jpg';
import defaultUserIcon from 'themes/images/default/userIcon.png';
import defaultBg from 'themes/images/others/mineBg.png';
import config, { userTag } from './config';
import request from './request';
import cookie from './cookie';
import formsubmit from './formsubmit';


const { userTag: { username, usertoken, userpower, userid, useravatar, userloginname, portalToken, portalUserId, orgCode, portalUserName, doubleTake, portalHeadImg, portalHeadImgGK, bkStudentNumber, userLoginId } } = config,
  // eslint-disable-next-line import/no-named-as-default-member
  { _cs, _cr, _cg } = cookie;

const userToken = () => _cg(usertoken);
// 日期格式化
const DateChange = function () {
  let date = new Date();
  let week = '日一二三四五六'.charAt(date.getDay());
  let newDate = `今天是${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 星期${week}`;
  return newDate;
};
/**
 * 建议用moment.js 当天网不行下不了依赖
 * @param date
 * @param details 是否显示时间默认显示
 * @param showWeek
 * @constructor
 */
const getCommonDate = (date, details = true, showWeek = true) => {
  if (date) {
    let preDate = new Date(date * 1000),
      week = '日一二三四五六'.charAt(preDate.getDay()),
      year = preDate.getFullYear(),
      hour = preDate.getHours() < 10 ? `0${preDate.getHours()}` : preDate.getHours(),
      minutes = preDate.getMinutes() < 10 ? `0${preDate.getMinutes()}` : preDate.getMinutes();
    if (details) {
      if (!showWeek) {
        return `${year}年${preDate.getMonth() + 1}月${preDate.getDate()}日${hour}:${minutes}`;
      }
      return `${year}年${preDate.getMonth() + 1}月${preDate.getDate()}日 星期${week} ${hour}:${minutes}`;
    }
    return `${year}年${preDate.getMonth() + 1}月${preDate.getDate()}日`;
  }
};
/**
 *
 * @param date
 * @constructor
 */
const changeLessonDate = (date) => {
  if (date === '0') {
    return '-';
  }
  if (date) {
    let currentDate = new Date();
    const currentYear = currentDate.getFullYear(),
      lessonDate = new Date(date * 1000),
      year = lessonDate.getFullYear();
    if (currentYear !== year) {
      return `${year}年${lessonDate.getMonth() + 1}月${lessonDate.getDate()}日`;
    }
    return `${lessonDate.getMonth() + 1}月${lessonDate.getDate()}日`;
  }
};
/**
 * 任务列表时间转换
 * @param date
 * @returns {string}
 */
const isToday = (date) => {
  if (date) {
    let currentDate = new Date();
    const lessonDate = new Date(date * 1000);
    if (currentDate.toDateString() <= lessonDate.toDateString()) {
      return true;
    }
    return false;
  }
};

const getMessageTime = (timeValue) => {
  let time = timeValue * 1000;

  function formatDateTime (time) {
    let date = new Date(time);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? (`0${m}`) : m;
    let d = date.getDate();
    d = d < 10 ? (`0${d}`) : d;
    let h = date.getHours();
    h = h < 10 ? (`0${h}`) : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? (`0${minute}`) : minute;
    second = second < 10 ? (`0${second}`) : second;
    return `${y}-${m}-${d} ${h}:${minute}:${second}`;
  }

  // 判断传入日期是否为昨天
  function isYestday (time) {
    let date = (new Date()); // 当前时间
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); // 今天凌晨
    let yestday = new Date(today - 24 * 3600 * 1000).getTime();
    return time < today && yestday <= time;
  }

  // 判断传入日期是否属于今年
  function isYear (time) {
    let takeNewYear = formatDateTime(new Date())
      .substr(0, 4); // 当前时间的年份
    let takeTimeValue = formatDateTime(time)
      .substr(0, 4); // 传入时间的年份
    return takeTimeValue === takeNewYear;
  }

  // 60000 1分钟
  // 3600000 1小时
  // 86400000 24小时
  // 对传入时间进行时间转换
  function timeChange (time) {
    let timeNew = Date.parse(new Date()); // 当前时间
    let timeDiffer = timeNew - time; // 与当前时间误差
    let returnTime = '';

    if (timeDiffer <= 60000) { // 一分钟内
      returnTime = '刚刚';
    } else if (timeDiffer > 60000 && timeDiffer < 3600000) { // 1小时内
      returnTime = `${Math.floor(timeDiffer / 60000)}分钟前`;
    } else if (timeDiffer >= 3600000 && timeDiffer < 86400000 && isYestday(time) === false) { // 今日
      returnTime = formatDateTime(time)
        .substr(11, 5);
    } else if (timeDiffer > 3600000 && isYestday(time) === true) { // 昨天
      returnTime = `昨天${formatDateTime(time)
        .substr(11, 5)}`;
    } else if (timeDiffer > 86400000 && isYestday(time) === false && isYear(time) === true) {	// 今年
      returnTime = formatDateTime(time)
        .substr(5, 11);
    } else if (timeDiffer > 86400000 && isYestday(time) === false && isYear(time) === false) { // 不属于今年
      returnTime = formatDateTime(time)
        .substr(0, 10);
    }

    return returnTime;
  }

  return timeChange(time);
};

const getSurplusDay = (data, state, timemodified = 0) => {
  const now = new Date();
  const getDays = (time) => {
    let days = time / 1000 / 60 / 60 / 24;
    let daysRound = Math.floor(days);
    let hours = time / 1000 / 60 / 60 - (24 * daysRound);
    let hoursRound = Math.floor(hours);
    let minutes = time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
    let minutesRound = Math.floor(minutes);
    let seconds = time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
    return `${daysRound > 0 ? `${daysRound}天` : ''}${hoursRound > 0 ? `${hoursRound}小时` : ''}${minutesRound}分钟`;
  };
  if (state === 'submitted') {
    const nowTime = data * 1000 - now;
    if (data * 1000 > now) {
      return getDays(nowTime);
    }
    if (data > timemodified) {
      const time = (data - timemodified) * 1000;
      return `提早了${getDays(time)}提交`;
    }
    const time = timemodified * 1000 - data * 1000;
    return `推迟了${getDays(time)}提交`;
  }
  if (data * 1000 > now) {
    const time = data * 1000 - now;
    return getDays(time);
  }
  return <span style={{ color: '#f34e14' }}>作业已截止</span>;
};

const getDurationDay = (num) => {
  let days = num / 60 / 60 / 24;
  let daysRound = Math.floor(days);
  return daysRound >= 7 ? '一周' : `${daysRound}天`;
};

const formateSeconds = (endTime) => {
  let secondTime = parseInt(endTime);
  let min = 0;
  let h = 0;
  let result = '';
  if (secondTime > 60) {
    min = parseInt(secondTime / 60);
    secondTime = parseInt(secondTime % 60);
    if (min > 60) {
      h = parseInt(min / 60);
      min = parseInt(min % 60);
    }
  }
  result = `${h.toString()
    .padStart(2, '0')}小时${min.toString()
    .padStart(2, '0')}分钟${secondTime.toString()
    .padStart(2, '0')}秒`;
  return result;
};

const getDurationTime = (start, end) => {
  const time = (end - start) * 1000;
  let days = time / 1000 / 60 / 60 / 24;
  let daysRound = Math.floor(days);
  let hours = time / 1000 / 60 / 60 - (24 * daysRound);
  let hoursRound = Math.floor(hours);
  let minutes = time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
  let minutesRound = Math.floor(minutes);
  let seconds = time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
  return `${daysRound > 0 ? `${daysRound}天` : ''}${hoursRound > 0 ? `${hoursRound}小时` : ''}${minutesRound > 0 ? `${minutesRound}分钟` : ''}${seconds}秒`;
};

const getAttendanceTime = (timeValue) => {
  let time = timeValue * 1000;

  function formatDateTime (time) {
    let date = new Date(time);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? (`0${m}`) : m;
    let d = date.getDate();
    d = d < 10 ? (`0${d}`) : d;
    let h = date.getHours();
    h = h < 10 ? (`0${h}`) : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? (`0${minute}`) : minute;
    second = second < 10 ? (`0${second}`) : second;
    return `${y}-${m}-${d} ${h}:${minute}:${second}`;
  }

  // 判断传入日期是否为昨天
  function isYestday (time) {
    let date = (new Date()); // 当前时间
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); // 今天凌晨
    let yestday = new Date(today - 24 * 3600 * 1000).getTime();
    return time < today && yestday <= time;
  }

  // 60000 1分钟
  // 3600000 1小时
  // 86400000 24小时
  // 对传入时间进行时间转换
  function timeChange (time) {
    let timeNew = Date.parse(new Date()); // 当前时间
    let timeDiffer = timeNew - time; // 与当前时间误差
    let returnTime = {};

    if (timeDiffer <= 120000) { // 一分钟内
      returnTime = {
        time: '刚刚',
        color: '#00bd06'
      };
    } else if (timeDiffer > 120000 && timeDiffer < 300000) { // 1-5分钟
      returnTime = {
        time: `${Math.floor(timeDiffer / 60000)}分钟前`,
        color: '#ffa22f'
      };
    } else if (timeDiffer > 300000 && timeDiffer < 600000) { // 5-10
      returnTime = {
        time: `${Math.floor(timeDiffer / 60000)}分钟前`,
        color: '#ffa22f'
      };
    } else if (timeDiffer > 600000 && timeDiffer < 3600000) { // 1小时内
      returnTime = {
        time: `${Math.floor(timeDiffer / 60000)}分钟前`,
        color: '#ff2222'
      };
    } else if (timeDiffer >= 3600000 && timeDiffer < 86400000 && isYestday(time) === false) { // 今日
      returnTime = {
        time: formatDateTime(time)
          .substr(11, 5),
        color: '#ff2222'
      };
    } else if (timeDiffer > 3600000 && isYestday(time) === true) { // 昨天
      returnTime = {
        time: `昨天${formatDateTime(time)
          .substr(11, 5)}`,
        color: '#ff2222'
      };
    } else if (timeDiffer > 86400000 && isYestday(time) === false) {
      returnTime = {
        time: formatDateTime(time),
        color: '#ff2222'
      };
    }
    return returnTime;

  }

  return timeChange(time);
};
/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  let r = window.location.search.substr(1)
    .match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
};

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null;
  }
  const item = array.filter(_ => _[keyAlias] === key);
  if (item.length) {
    return item[0];
  }
  return null;
};

const isUsefulPic = (src) => {
  const ImgObj = new Image();
  ImgObj.src = src;

  return ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0);
};

const bkIdentity = () => {
  return _cg('orgCode') === 'bjou_student';
};

const oldAPP = () => {
  return _cg('oldAPP');
};
/**
 *
 * @param path
 * @param type 传一个任意字符串获取头像 默认为课程图片
 * @returns {*}
 */
const getImages = (path = '', type = 'defaultImg') => {
  if (path instanceof Blob || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  if (path === '' || !path) {
    return type === 'defaultImg' ? defaultImg : defaultUserIcon;
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path.match(/token=/) ? path : `${path}?token=${userToken()}`;
  }
  return `${config.baseURL + (path.startsWith('/') ? '' : '/') + path}`.match(/token=/) ?
         `${config.baseURL + (path.startsWith('/') ? '' : '/') + path}`
                                                                                        :
         (`${config.baseURL + (path.startsWith('/') ? '' : '/') + path}?token=${userToken()}`);
};


const getPortalAvatar = (url, fileId) => {
  if (fileId) {
    return `${url}?fileId=${fileId}`;
  }
  return defaultUserIcon;
};
/** *
 * 用户信息默认背景图片
 * @param path
 * @returns {*}
 */
const getDefaultBg = (path = '') => {
  if (path instanceof Blob || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  if (path === '' || !path) {
    return defaultBg;
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    if (path.match(/token=/)) {
      return isUsefulPic(path) ? path : defaultBg;
    }
    return isUsefulPic(`${path}?token=${userToken()}`) ? `${path}?token=${userToken()}` : defaultBg;
  }
  return `${config.baseURL + (path.startsWith('/') ? '' : '/') + path}`.match(/token=/) ?
         isUsefulPic(`${config.baseURL + (path.startsWith('/') ? '' : '/') + path}`) ?
         `${config.baseURL + (path.startsWith('/') ? '' : '/') + path}`
                                                                                     :
         defaultBg
                                                                                        :
         isUsefulPic((`${config.baseURL + (path.startsWith('/') ? '' : '/') + path}?token=${userToken()}`))
         ?
         (`${config.baseURL + (path.startsWith('/') ? '' : '/') + path}?token=${userToken()}`)
         :
         defaultBg;
};

const getErrorImg = (el, type = 'default') => {
  if (el && el.target) {
    if (type !== 'user') {
      el.target.src = defaultImg;
      el.target.onerror = null;
    } else {
      el.target.src = defaultUserIcon;
      el.target.onerror = null;
    }
  }
};

const setOldLoginIn = ({ user_token, user_name, user_pwd, user_id, user_avatar, user_login_name }) => {
  _cs(username, user_name);
  _cs(userpower, user_pwd);
  _cs(usertoken, user_token);
  _cs(userid, user_id);
  _cs(useravatar, user_avatar);
  _cs(userloginname, user_login_name);
  cnSetAlias(user_login_name, user_token);
};

const setLoginIn = ({ user_id, user_token }) => {
  _cs(usertoken, user_token);
  _cs(userid, user_id);
};

const setSession = (obj) => {
  Object.keys(obj)
    .map(keys => {
      if (obj[keys]) {
        _cs(keys, obj[keys]);
      }
    });
};
const setLoginOut = () => {
  _cr(username);
  _cr(`menu_${_cg(userLoginId)}`);
  _cr(userpower);
  _cr(usertoken);
  _cr(userid);
  _cr(useravatar);
  _cr(portalUserId);
  _cr(orgCode);
  _cr(portalUserName);
  _cr(doubleTake);
  _cr(portalHeadImg);
  _cr(portalToken);
  _cr('oldAPP');
  _cr(bkStudentNumber);
  _cr(userLoginId);
  cnDeleteAlias(_cg(userloginname), _cg(usertoken));
};
const getLocalIcon = (icon = '') => {
  const regex = /\/([^\/]+?)\./g;
  let addIconName = [];
  if (icon.startsWith('/') && (addIconName = regex.exec(icon)) && addIconName.length > 1) {
    const addIcon = require(`svg/${icon.substr(1)}`);
    return `${addIconName[1]}`;
  }
  return icon;
};

const getAntTabBar = () => {
  const tabBarEl = document.querySelector('.am-tabs-tab-bar-wrap .am-tab-bar-bar');
  return tabBarEl && tabBarEl.clientHeight ? tabBarEl : '';
};

/**
 *
 * @param el 当前元素
 * @returns {number} 父元素不是body时元素相对body的offsetTop
 */
const getOffsetTopByBody = (el) => {
  let offsetTop = 0,
    tabbarDiv;
  while (el && el.tagName !== 'BODY') {
    offsetTop += el.offsetTop;
    el = el.offsetParent;
  }
  if ((tabbarDiv = getAntTabBar()) && tabbarDiv.offsetTop) {
    offsetTop += cnhtmlHeight <= tabbarDiv.offsetTop ? tabbarDiv.offsetHeight : (cnhtmlHeight - tabbarDiv.offsetTop);
  }
  return offsetTop - cnGetInitPaddingTop() + 1;
};


const replaceSystemEmoji = (content) => {
  const ranges = [
    '\ud83c[\udf00-\udfff]',
    '\ud83d[\udc00-\ude4f]',
    '\ud83d[\ude80-\udeff]'
  ];
  return content.replace(new RegExp(ranges.join('|'), 'g'), '')
    .replace(/\[\/.+?\]/g, '');
};

const hasSystemEmoji = (content) => {
  const ranges = [
    '\ud83c[\udf00-\udfff]',
    '\ud83d[\udc00-\ude4f]',
    '\ud83d[\ude80-\udeff]'
  ];
  return content.match(new RegExp(ranges.join('|'), 'g'));
};
const getTitle = (title) => {
  return title.length > 10 ? `${title.substring(0, 9)}...` : title;
};

/**
 * 本地获取任务列表icon
 * @param type
 */
const getTaskIcon = (type) => {
  if (type === 'assign') {
    return '/lessontype/homework.svg';
  } else if (type === 'quiz') {
    return '/lessontype/test.svg';
  } else if (type === 'forum') {
    return '/lessontype/huodong.svg';
  }
  return '';
};

const pattern = (type) => {
  const obj = {};
  obj.href = /[a-zA-z]+:\/\/[^\\">]*/g;
  obj.svg = /mymobile/ig;
  obj.phone = /^1\d{10}$/;
  obj.email = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  return obj[type];
};

const renderSize = (fileSize) => {
  if (fileSize < 1024) {
    return `${fileSize}B`;
  } else if (fileSize < (1024 * 1024)) {
    let temp = fileSize / 1024;
    temp = temp.toFixed(2);
    return `${temp}KB`;
  } else if (fileSize < (1024 * 1024 * 1024)) {
    let temp = fileSize / (1024 * 1024);
    temp = temp.toFixed(2);
    return `${temp}MB`;
  }
  let temp = fileSize / (1024 * 1024 * 1024);
  temp = temp.toFixed(2);
  return `${temp}GB`;
};

const textToElement = (text) => {
  let element = document.createElement('div');
  element.innerHTML = text;
  return element;
};

const needRefreshRouters = {},
  isRouterNeedRefresh = (router) => {
    if (router && needRefreshRouters.hasOwnProperty(router)) {
      delete needRefreshRouters[router];
      return true;
    }
    return false;
  },
  setRouterNeedRefresh = (router) => {
    if (router) {
      needRefreshRouters[router] = true;
    }
  };


const deleteHtmlTag = (str) => {
  str = str.replace(/<[^>]+>|&[^>]+;/g, '')
    .trim();// 去掉所有的html标签和&nbsp;之类的特殊符合
  return str;
};

const getRule = (arr, val) => {
  let res = true;
  let message = [];
  arr.map(item => {
    if (item === 1) {
      res = res && /[0-9]/g.test(val);
      if (!/[0-9]/g.test(val)) {
        message.push('数字');
      }
    } else if (item === 2) {
      res = res && /[a-z]/g.test(val);
      if (!/[a-z]/g.test(val)) {
        message.push('小写字母');
      }
    } else if (item === 3) {
      res = res && /[A-Z]/g.test(val);
      if (!/[A-Z]/g.test(val)) {
        message.push('大写字母');
      }
    } else if (item === 4) {
      res = res && /[~#^$@%&!*]/g.test(val);
      if (!/[~#^$@%&!*]/g.test(val)) {
        message.push('~#^$@%&!*等特殊字符');
      }
    }


    // switch (item) {
    //   case 1:
    //     message.push('数字');
    //     res = res && /[0-9]/g.test(val);
    //     break;
    //   case 2:
    //     message.push('小写字母');
    //     res = res && /[a-z]/g.test(val);
    //     break;
    //   case 3:
    //     message.push('大写字母');
    //     res = res && /[A-Z]/g.test(val);
    //     break;
    //   case 4:
    //     message.push('~#^$@%&!*等特殊字符');
    //     res = res && /[~#^$@%&!*]/g.test(val);
    //     break;
    //   default :
    //     return res;
    // }
  });
  // res.map(every => every.message = `密码必须包含${message.join()}`);
  return {
    result: res,
    message
  };
};

const getValideError = (obj = {}) => {
  for (let val in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, val) && obj[val] && obj[val].errors && cnIsArray(obj[val].errors)) {
      return obj[val].errors[0].message || '你输入的信息有误，请点击表单后的感叹号图标查看具体信息';
    }
    return '你输入的信息有误，请点击表单后的感叹号图标查看具体信息';
  }
};

const urlEncode = (str) => {
  str = (str + '').toString();
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/%20/g, '+');
};

module.exports = {
  config,
  request,
  cookie,
  userToken,
  classnames,
  getErrorImg,
  getDefaultBg,
  isUsefulPic,
  getImages,
  queryURL,
  setLoginIn,
  queryArray,
  getOffsetTopByBody,
  timeStamp: () => (new Date()).getTime(),
  isEmptyObject: (obj) => Object.keys(obj).length === 0,
  getLocalIcon,
  formsubmit,
  setLoginOut,
  replaceSystemEmoji,
  hasSystemEmoji,
  DateChange,
  getTitle,
  getAntTabBar,
  changeLessonDate,
  getTaskIcon,
  isToday,
  getMessageTime,
  getCommonDate,
  getSurplusDay,
  getDurationDay,
  pattern,
  renderSize,
  textToElement,
  isRouterNeedRefresh,
  setRouterNeedRefresh,
  getDurationTime,
  deleteHtmlTag,
  bkIdentity,
  setSession,
  getPortalAvatar,
  getRule,
  formateSeconds,
  setOldLoginIn,
  oldAPP,
  getValideError,
  getAttendanceTime,
  urlEncode
};
