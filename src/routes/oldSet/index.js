/* eslint-disable indent */
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
  Toast
} from 'components';
import Nav from 'components/nav';
import { getImages, getErrorImg, getLocalIcon, renderSize } from 'utils';
import { routerRedux } from 'dva/router';
import { baseURL, api } from 'utils/config';
import styles from './index.less';

const PrefixCls = 'oldMine';

function OldSet ({ location, dispatch, oldMine, app }) {
  const { users: { username, useravatar }, isLogin, updates: { urls = '', appVerSion = '', updateInfo = '' }, isTestUser = false } = app,
    { name } = location.query,
    { localFileTotals, clearProgress = 0, uploadLogState } = oldMine,
    getContent = (content) => {
      return (
        <div
          style={{ maxHeight: '60vh', overflowY: 'scroll', textAlign: 'left' }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    },
    handleUpdateClick = (urls, appVerSion, updateInfo) => {
      if (urls !== '') {
        Modal.alert(`版本更新(V${appVerSion})`, getContent(updateInfo), [
          {
            text: '以后再说',
            onPress: () => dispatch({
              type: 'app/updateState',
              payload: {
                showModal: false,
              },
            }),
            style: 'default',
          },
          { text: '现在升级', onPress: () => cnUpdate(urls) },
        ]);
      } else {
        Toast.offline('已经是最新版本啦(#^.^#)');
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
            },
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
        type: 'app/logout',
      });
    },
    showAlert = () => {
      Modal.alert('退出', '您确定要退出学习状态吗？', [
        {
          text: ' 立即退出',
          onPress: handleLoginout,
        },
        { text: '暂不', onPress: () => console.log('cancel') },

      ]);
    };
  return (
    <div >
      <WhiteSpace />
      <Nav title={name} dispatch={dispatch} />
      <div className={styles[`${PrefixCls}-info`]} >
        <List >
          {
            <List.Item
              thumb={<Icon type={getLocalIcon('/mine/clear.svg')} />}
              extra={renderSize(localFileTotals)}
              onClick={handleClearFileCache.bind(null)}
            >
              清理缓存
            </List.Item >
          }
          <List.Item
            thumb={<Icon type={getLocalIcon('/mine/edition.svg')} />}
            extra={`${cnVersion}.${cnCheckCodeVersion(cnCodeVersion, [1, 1, 1])}`}
            onClick={handleUpdateClick.bind(null, urls, appVerSion, updateInfo)}
          >
            {urls !== '' ? <Badge dot >
              版本信息
            </Badge > : '版本信息'}
          </List.Item >
          {isTestUser === true ? <List.Item
            thumb={<Icon type={'check-circle-o'} size="xs" color="#22609c" />}
            extra={uploadLogState === true ? <Icon type={'loading'} size="xs" color="#22609c" /> : ''}
            onClick={uploadLogState === true ? null : handleUploadClick.bind(null)}
          >
            提交运行日志
          </List.Item > : ''}
        </List >
      </div >
      <WhiteSpace size="lg" />
      <WingBlank >
        <Button
          style={{ border: '1px solid #fff', color: '#fff', background: '#f34e14', borderRadius: '30px' }}
          type="primary"
          onClick={showAlert}
        >退出</Button >
      </WingBlank >
      <ActivityIndicator
        toast
        text={clearProgress}
        animating={clearProgress !== 0}
      />
    </div >
  );
}

export default connect(({ oldMine, app }) => ({
  oldMine,
  app,
}))(OldSet);
