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
import _ from 'lodash';
import styles from './index.less';

const PrefixCls = 'oldMine';

function OldSet ({ location, dispatch, oldMine, app }) {
  const { updates: { urls = '', appVerSion = '', updateInfo = '' }, isTestUser = false } = app,
    { name } = location.query,
    { localFileTotals, clearProgress = 0, uploadLogState, showModal, dialog } = oldMine,
    currentCodeVersion = cnCheckCodeVersion(cnCodeVersion, [1, 1, 1]),
    progress = _.throttle((downloadProgress) => {
      dispatch({
        type: 'oldMine/updateState',
        payload: {
          dialog: {
            ...dialog,
            content: `${renderSize(downloadProgress.receivedBytes)}/${renderSize(downloadProgress.totalBytes)}`
          }
        }
      });
    }, 300),
    getContent = (content) => {
      return (
        <div
          style={{ maxHeight: '60vh', overflowY: 'scroll', textAlign: 'left' }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    },
    renderStatus = () => {
      return (
        <div>
          <div>{dialog.status}</div>
          <div>{dialog.content}</div>
        </div>
      );
    },
    statusCallback = (status) => {
      //  官方文档没找到说明以下为猜测：
      // 5：检查更新
      // 7:下载更新
      // 8:安装更新
      // 1:安装完成
      switch (status) {
        case 7:
          dispatch({
            type: 'oldMine/updateState',
            payload: {
              dialog: {
                ...dialog,
                status: '更新资源下载中',
                statusCode: status
              }
            }
          });
          break;
        case 8:
          dispatch({
            type: 'oldMine/updateState',
            payload: {
              dialog: {
                ...dialog,
                status: '下载完成，安装中',
                statusCode: status
              }
            }
          });
          break;
        case 1:
          dispatch({
            type: 'oldMine/updateState',
            payload: {
              dialog: {
                ...dialog,
                status: '安装完成',
                content: '重启APP后生效',
                buttonText: '立即重启',
                statusCode: status
              }
            }
          });
          break;
        case 0:
          dispatch({
            type: 'oldMine/updateState',
            payload: {
              dialog: {
                ...dialog,
                status: '更新已完成',
                content: '重启APP后生效',
                buttonText: '立即重启',
                statusCode: status
              }
            }
          });
          break;
        default :
          break;
      }
      console.log(`status:${status}`);
    },

    downloadProgressCallback = (downloadProgress) => {
      progress(downloadProgress);
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
          {
            text: '现在升级', onPress: () => cnUpdate(url)
          }
        ]);
      } else if (cnRemoteCodeVersion > currentCodeVersion) {
        dispatch({
          type: 'oldMine/updateState',
          payload: {
            showModal: true
          }
        });
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
        { text: '暂不', onPress: () => console.log('cancel') }

      ]);
    };
  return (
    <div>
      <WhiteSpace />
      <Nav title={name} dispatch={dispatch} />
      <div className={styles[`${PrefixCls}-info`]}>
        <List>
          {
            <List.Item
              thumb={<Icon type={getLocalIcon('/mine/clear.svg')} />}
              extra={renderSize(localFileTotals)}
              onClick={handleClearFileCache.bind(null)}
            >
              清理缓存
            </List.Item>
          }
          <List.Item
            thumb={<Icon type={getLocalIcon('/mine/edition.svg')} />}
            extra={`${cnVersion}.${currentCodeVersion}`}
            onClick={() => handleUpdateClick(urls, appVerSion, updateInfo)}
          >
            {urls !== '' || cnRemoteCodeVersion > currentCodeVersion ? <Badge dot>
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
        </List>
      </div>
      <WhiteSpace size="lg" />
      <WingBlank>
        <Button
          style={{ border: '1px solid #fff', color: '#fff', background: '#f34e14', borderRadius: '30px' }}
          type="primary"
          onClick={showAlert}
        >退出</Button>
      </WingBlank>
      <Modal
        visible={showModal}
        transparent
        maskClosable={false}
        title="APP有新的更新"
        footer={[
          {
            text: '稍后再说',
            onPress: () => {
              dispatch({
                type: 'oldMine/updateState',
                payload: {
                  showModal: false
                }
              });
            }
          },
          {
            text: dialog.buttonText,
            onPress: () => {
              if (dialog.statusCode == 0 || dialog.statusCode == 1) {
                if (window.codePush) {
                  codePush.restartApplication();
                } else {
                  Toast.fail('暂时无法升级');
                }
              } else {
                cnManualCodePush(statusCallback, downloadProgressCallback,
                  (error) => {
                    dispatch({
                      type: 'oldMine/updateState',
                      payload: {
                        showModal: false
                      }
                    });
                    Toast.fail('升级失败请稍后再试');
                    console.log(`error:${error}`);
                  });
              }
            }
          }
        ]}
      >
        <div style={{ textAlign: 'center' }}>
          {renderStatus()}
        </div>
      </Modal>
      <ActivityIndicator
        toast
        text={clearProgress}
        animating={clearProgress !== 0}
      />
    </div>
  );
}

export default connect(({ oldMine, app }) => ({
  oldMine,
  app
}))(OldSet);
