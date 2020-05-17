/* eslint-disable indent */
/**
 * @author Lowkey
 * @date 2020/03/10 14:25:04
 * @Description: 设置界面修改
 */
import React from 'react';
import { connect } from 'dva';
import {
  Button,
  Flex,
  WingBlank,
  WhiteSpace,
  List,
  Icon,
  Modal,
  Badge,
  ActivityIndicator,
  Toast,
  ActionSheet
} from 'components';
import Nav from 'components/nav';
import { getImages, getErrorImg, getLocalIcon, renderSize, cookie, setSession } from 'utils';
import { handlerChangeRouteClick } from 'utils/commonevents';
import { routerRedux } from 'dva/router';
import { baseURL, api } from 'utils/config';
import styles from './index.less';

const { _cg } = cookie;
const { HelpUrl } = api;
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault()
  };
}

const PrefixCls = 'mine';

function Set ({ location, dispatch, mine, app }) {
  const { updates: { urls = '', appVerSion = '', updateInfo = '' }, isTestUser = false } = app,
    { name = '设置' } = location.query,
    { localFileTotals, clearProgress = 0, uploadLogState } = mine,
    getContent = (content) => {
      return (
        <div
          style={{ maxHeight: '60vh', overflowY: 'scroll', textAlign: 'left' }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    },
    handleUpdateClick = (url, version, info) => {
      if (url !== '') {
        Modal.alert(`版本更新(V${version})`, getContent(info), [
          {
            text: '以后再说',
            onPress: () => dispatch({
              type: 'app/updateState',
              payload: {
                showModal: false
              }
            }),
            style: 'default'
          },
          { text: '现在升级', onPress: () => cnUpdate(url) }
        ]);
      } else {
        Toast.success('已经是最新版本啦(#^.^#)');
      }
    },
    handleClearFileCache = () => {
      dispatch({
        type: `${PrefixCls}/updateState`,
        payload: {
          clearProgress: '清理中...'
        }
      });
      dispatch({
        type: 'app/removeAllLocalFiles',
        cb: () => {
          dispatch({
            type: `${PrefixCls}/updateState`,
            payload: {
              localFileTotals: cnGetLocalFileSize(),
              clearProgress: 0
            }
          });
          Toast.success('清理成功');
        }
      });
    },
    handleUploadClick = () => {
      if (cnRunningLogMessages && cnIsArray(cnRunningLogMessages) && cnRunningLogMessages.length) {
        dispatch({
          type: `${PrefixCls}/uploadLogState`,
          payload: {
            msg: cnRunningLogMessages.join('\n')
          }
        });
      } else {
        Toast.success('提交成功。');
      }
    },
    handleLoginout = () => {
      dispatch({
        type: 'app/logout'
      });
    },
    showAlert = () => {
      Modal.alert('退出', '您确定要退出学习状态吗？', [
        {
          text: ' 立即退出',
          onPress: handleLoginout
        },
        { text: '暂不' }
      ]);
    },

    handlerHelpClick = () => {
      if (cnOpen) {
        cnOpen(HelpUrl());
      }
    },
    showActionSheet = () => {
      const BUTTONS = ['北开学生', '国开学生', '取消'];
      ActionSheet.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: BUTTONS.length - 1,
          maskClosable: true,
          'data-seed': 'logId',
          wrapProps
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            dispatch({
              type: 'app/queryMoodleToken'
            });
          } else if (buttonIndex === 1) {
            setSession({ orgCode: 'ouchn_student' });
            dispatch(routerRedux.push({
              pathname: '/',
              query: {
                orgCode: 'ouchn_student'
              }
            }));
          }
        }
      );
    };

  return (
    <div className={styles.container}>
      <Nav title={name} dispatch={dispatch} isGoBack={false} navFixed={false} />
      <div className={styles.info}>
        <List>
          {
            <List.Item
              thumb={<Icon type={getLocalIcon('/set/clear.svg')} />}
              extra={renderSize(localFileTotals)}
              onClick={handleClearFileCache.bind(null)}
            >
              清理缓存
            </List.Item>
          }
          <List.Item
            thumb={<Icon type={getLocalIcon('/set/edition.svg')} />}
            extra={`${cnVersion}.${cnCheckCodeVersion(cnCodeVersion, [1, 1, 1])}`}
            onClick={handleUpdateClick.bind(null, urls, appVerSion, updateInfo)}
          >
            {urls !== '' ? <Badge dot>
              版本信息
            </Badge> : '版本信息'}
          </List.Item>
          {isTestUser === true ? <List.Item
            thumb={<Icon type={'check-circle-o'} size="xs" color="#22609c" />}
            extra={uploadLogState === true ? <Icon type={'loading'} size="xs" color="#22609c" /> : ''}
            onClick={uploadLogState === true ? null : handleUploadClick.bind(null)}
          >
            提交运行日志
          </List.Item> : ''}
          <List.Item
            thumb={<Icon type={getLocalIcon('/set/opinion.svg')} />}
            onClick={handlerChangeRouteClick.bind(this, 'opinion', { name: '意见反馈' }, dispatch)}
            arrow="horizontal"
          >
            意见反馈
          </List.Item>
          <List.Item
            thumb={<Icon type={getLocalIcon('/set/help.svg')} />}
            arrow="horizontal"
            onClick={handlerHelpClick}
          >
            使用帮助
          </List.Item>
        </List>
      </div>
      <WhiteSpace />
      {
        _cg('doubleTake')
        ?
        <div className={styles.system} onClick={showActionSheet}>系统切换</div>
        :
        null
      }

      <WhiteSpace size="lg" />
      <div className={styles.wrapper}>
        <Button
          className={styles.btn}
          type="primary"
          onClick={showAlert}
        >退出</Button>
      </div>
      <ActivityIndicator
        toast
        text={clearProgress}
        animating={clearProgress !== 0}
      />
    </div>
  );
}

export default connect(({ mine, app, login }) => ({
  mine,
  app,
  login
}))(Set);
