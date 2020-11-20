/**
 * @author Lowkey
 * @date 2019/03/19 16:51:45
 * @Description:
 */
import React from 'react';
import { connect } from 'dva';
import { Icon, Button, WingBlank, Modal, List } from 'components';
import { getImages, getErrorImg, getLocalIcon, getDefaultBg } from 'utils';
import Photoheader from 'components/photoheader';
import { routerRedux } from 'dva/router';
import { handlerChangeRouteClick } from 'utils/commonevents';
import styles from './index.less';

const PrefixCls = 'oldHomePage'


function HomePage ({ location, dispatch, oldHomePage, app }) {
  const { users: { username } } = app,
    { data: { idnumber = '', email = '', phone = '', avatar = '', selfdescription = '' } } = oldHomePage

  return (
    <div >
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
          <div className={styles[`${PrefixCls}-info-username`]} >{username}</div >
          <div className={styles[`${PrefixCls}-info-signature`]} >{selfdescription}</div >

          <div className={styles[`${PrefixCls}-info-button`]} >
            <Button
              onClick={handlerChangeRouteClick.bind(this, 'oldSetup', { name: '编辑个人信息' }, dispatch)}
              type="primary"
              inline
              size="small"
            >编辑个人信息</Button >
          </div >
        </div >
      </div >
      <div className={styles[`${PrefixCls}-list`]} >
        <List className="my-list" >
          <List.Item
            thumb={<Icon type={getLocalIcon('/old/studentID.svg')} />}
            extra={idnumber === '' ? '-' : idnumber}
          >
            学号
          </List.Item >
          <List.Item thumb={<Icon type={getLocalIcon('/old/email.svg')} />} extra={email} >邮箱</List.Item >
          <List.Item thumb={<Icon type={getLocalIcon('/old/phone.svg')} />} extra={phone} >手机号</List.Item >
        </List >
      </div >
    </div >
  );
}

export default connect(({ oldHomePage, app }) => ({
  oldHomePage,
  app,
}))(HomePage);
