import React from 'react';
import bgs from 'themes/images/login/loginBg.png';
import { ActionSheet } from 'components';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { setLoginIn, setSession, config, cookie } from 'utils';
import logo from '../../themes/images/loginLogo.png';
import styles from './Login.less';

const { userTag: { portalToken } } = config,
  { _cg } = cookie;

let once = true;
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault()
  };
}
const Login = (props) => {
  const { login = {} } = props;
  const { isDoubleTake = false } = login;
  const showActionSheet = (show) => {
    const BUTTONS = ['北开学生', '国开学生', '取消'];
    if (show && once) {
      once = false;
      ActionSheet.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: BUTTONS.length - 1,
          maskClosable: true,
          'data-seed': 'logId',
          wrapProps
        },
        (buttonIndex) => {
          once = true;
          props.dispatch({
            type: 'login/updateState',
            payload: {
              isDoubleTake: false
            }
          });
          if (buttonIndex === 0) {
            props.dispatch({
              type: 'login/queryMoodleToken'
            });
          } else if (buttonIndex === 1) {
            setSession({ orgCode: 'ouchn_student' });
            props.dispatch({
              type: 'login/checkFirstLogin',
              payload: {
                access_token: _cg(portalToken) || '',
                orgCode: 'ouchn_student'
              }
            });
          }
        }
      );
    }
  };
  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${bgs})`}}
    >
      <div className={styles.loginBox}>
        {
          /login/.test(props.location.pathname) ?
          <div className={styles.logo}>
            <img src={logo} alt="" />
          </div>
                                                :
          null
        }
        {props.children}
      </div>
      <div>{showActionSheet(isDoubleTake)}</div>
    </div>
  );
};

export default connect(({ loading, login }) => ({ loading, login }))(Login);
