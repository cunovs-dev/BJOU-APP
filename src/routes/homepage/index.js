/**
 * @author Lowkey
 * @date 2020/03/13 18:00:14
 * @Description: 个人信息
 */
import React from 'react';
import { connect } from 'dva';
import { Icon, Button, WingBlank, Modal, List } from 'components';
import { routerRedux } from 'dva/router';
import { getErrorImg, getLocalIcon, config, getPortalAvatar } from 'utils';
import Photoheader from 'components/photoheader';
import { handlerChangeRouteClick } from 'utils/commonevents';
import bg from '../../themes/images/others/homePageBg.png';
import styles from './index.less';

const { api: { EnclosureDownload } } = config;

function HomePage ({ location, dispatch, homepage }) {
  const { gkData = {}, data: { gender = '', nation = '', studentNumber = '', headImg, educational, userName, arrangement, major, phone, administrative, isEnable, email, createDate, enrollmentdate, createUser } } = homepage;
  const { studentNumber: gkStudentNumber, headImg: gkHeadImg, majorLevel, schoolYear, className } = gkData;
  return (
    <div>
      <div className={styles.top} style={{ backgroundImage: `url(${bg})` }}>
        <Photoheader dispatch={dispatch} />
        <div className={styles.info}>
          <img src={getPortalAvatar(EnclosureDownload, headImg || gkHeadImg)} alt=""
               onError={(el => getErrorImg(el, 'user'))} />
          <div className={styles.right}>
            <div className={styles.rightTop}>
              <div className={styles.username}>
                {userName}
                {
                  gender !== '' ?
                  <Icon
                    style={{ marginLeft: '18px' }}
                    type={getLocalIcon(`/sprite/${parseInt(gender, 10) === 2 || gender === '女' ? 'female' : 'male'}.svg`)}
                  />
                                :
                  null
                }
              </div>
              <Icon
                type={getLocalIcon('/sprite/edit.svg')}
                onClick={handlerChangeRouteClick.bind(this, 'setup', { name: '编辑个人信息' }, dispatch)}
              />
            </div>
            <div>
              {
                className ?
                className
                          :
                `${administrative || ''} ${major || ''}`
              }
            </div>
          </div>
        </div>
        <div className={styles.footer} />
      </div>
      <div className={styles.list}>
        <List>
          <List.Item
            thumb={<Icon type={getLocalIcon('/sprite/studentID.svg')} />}
            extra={studentNumber || gkStudentNumber}
          >
            学号
          </List.Item>
          <List.Item thumb={<Icon type={getLocalIcon('/sprite/email.svg')} />} extra={email}>邮箱</List.Item>
          <List.Item thumb={<Icon type={getLocalIcon('/sprite/nation.svg')} />} extra={nation}>民族</List.Item>
          <List.Item thumb={<Icon type={getLocalIcon('/sprite/phone.svg')} />} extra={phone}>手机号</List.Item>
          <List.Item thumb={<Icon type={getLocalIcon('/sprite/arrangement.svg')} />}
                     extra={arrangement || majorLevel}>层次</List.Item>
          {
            educational ?
            <List.Item thumb={<Icon type={getLocalIcon('/sprite/educational.svg')} />}
                       extra={educational}>学制</List.Item>
                        :
            null
          }
          <List.Item thumb={<Icon type={getLocalIcon('/sprite/createDate.svg')} />}
                     extra={enrollmentdate || schoolYear}>招生年度</List.Item>
        </List>
      </div>
    </div>
  );
}

export default connect(({ homepage }) => ({
  homepage
}))(HomePage);
