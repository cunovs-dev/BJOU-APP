/* eslint-disable indent */
import React from 'react';
import { connect } from 'dva';
import { Icon, Button, List, Modal } from 'components';
import { getImages, getErrorImg, getLocalIcon, getDefaultBg } from 'utils';
import { handlerChangeRouteClick } from 'utils/commonevents';
import Photoheader from 'components/photoheader';
import InnerHtml from 'components/innerhtml';
import { routerRedux } from 'dva/router';
import styles from './index.less';

const PrefixCls = 'userpage',
  Item = List.Item,
  alert = Modal.alert;

const getStatus = (arr, id) => arr.find(item => parseInt(item.id, 10) === parseInt(id, 10));
const addText = '添加联系人';
const deleteText = '删除联系人';

function UserPage ({ location, dispatch, userpage, addLoading, deleteLoading }) {
  const { data: { avatar = '', email = '', selfDescription = '', fullname = '', id = '' }, contacts } = userpage,

    handlerAddContacts = () => {
      dispatch({
        type: 'userpage/addContact',
        payload: {
          touserid: id
        }
      });
    },
    handlerDeleteContacts = () => {
      dispatch({
        type: 'userpage/deleteContact',
        payload: {
          touserid: id
        }
      });
    },
    modalShow = (text) => {
      const alertInstance = alert('', `确定${text}?`, [
        {
          text: '取消',
          onPress: () => console.log('cancel'),
          style: 'default',
        },
        {
          text: '确定',
          onPress: () => (text === addText ? handlerAddContacts() : handlerDeleteContacts()),
        },
      ]);
      setTimeout(() => {
        // 可以调用close方法以在外部close
        alertInstance.close();
      }, 10000);
    };
  return (
    <div style={{ height: '100vh', background: 'white' }} >
      <div className={styles[`${PrefixCls}-top`]} >
        <Photoheader dispatch={dispatch} />
        <div style={{ overflow: 'hidden' }} >
          <div
            className={styles[`${PrefixCls}-top-bg`]}
            style={{ backgroundImage: `url(${getDefaultBg(avatar)})` }}
          />
        </div >
        <div className={styles[`${PrefixCls}-top-avatar`]} >
          <img src={getImages(avatar, 'user')} alt="" onError={(el => getErrorImg(el, 'user'))} />
        </div >
        <div className={styles[`${PrefixCls}-info`]} >
          <div className={styles[`${PrefixCls}-info-username`]} >{fullname}</div >
          <div className={styles[`${PrefixCls}-info-signature`]} ><InnerHtml data={selfDescription} /></div >
          <div className={styles[`${PrefixCls}-info-button`]} >
            <Button
              type="primary"
              inline
              size="small"
              onClick={handlerChangeRouteClick.bind(null, 'conversation', {
                fromuserid: id,
                name: fullname,
                avatar
              }, dispatch)}
            >发消息</Button >
          </div >
        </div >
      </div >
      <div className={styles[`${PrefixCls}-list`]} >
        <List >
          <Item extra={email} >邮箱</Item >
        </List >
      </div >
      <div style={{ padding: '1rem 0', background: 'white' }} >
        {getStatus(contacts, id) ?
          <Button
            type="primary"
            loading={addLoading}
            style={{ margin: '0 1rem' }}
            // icon={<Icon color="#22609c" size="xs" type={getLocalIcon('/buttons/man.svg')} />}
            onClick={() => modalShow(deleteText)}
          >{deleteText}
          </Button > :
          <Button
            type="primary"
            loading={deleteLoading}
            style={{ margin: '0 1rem' }}
            // icon={<Icon color="#22609c" size="xs" type={getLocalIcon('/buttons/man.svg')} />}
            onClick={() => modalShow(addText)}
          >{addText}</Button >}
      </div >
    </div >
  );
}

export default connect(({ userpage, app, loading }) => ({
  userpage,
  app,
  addLoading: loading.effects['userpage/addContact'],
  deleteLoading: loading.effects['userpage/deleteContact'],
}))(UserPage);
