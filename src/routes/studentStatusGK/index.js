/**
 * @author Lowkey
 * @date 2020/03/13 18:00:14
 * @Description: 个人信息
 */
import React from 'react';
import { connect } from 'dva';
import { Icon, Button, WingBlank, Modal, List } from 'components';
import Tag from 'components/tag';
import { routerRedux } from 'dva/router';
import { getErrorImg, getLocalIcon, config, getPortalAvatar } from 'utils';
import Photoheader from 'components/photoheader';
import bg from '../../themes/images/others/homePageBg.png';
import styles from './index.less';

const { api: { EnclosureDownload } } = config;

function StudentStatusGK ({ location, dispatch, studentStatusGK }) {
  const { data } = studentStatusGK;
  const { studentNumber = '', headImg = '', majorLevel, userName, mobilePhone, arrangement, studentState, className, email, schoolYear, schoolTerm, createUser } = data;
  console.log(studentNumber);
  return (
    <div>
      <div className={styles.top} style={{ backgroundImage: `url(${bg})` }}>
        <Photoheader dispatch={dispatch} />
        <div className={styles.info}>
          <img src={getPortalAvatar(EnclosureDownload, headImg)} alt="" onError={(el => getErrorImg(el, 'user'))} />
          <div className={styles.right}>
            <div className={styles.rightTop}>
              <div className={styles.username}>
                <span> {userName}</span>
                <Tag text={studentState} color="cyan" size="xs" inline />
              </div>
            </div>
            <div>
              {className}
            </div>
          </div>
        </div>
        <div className={styles.footer} />
      </div>
      <div className={styles.list}>
        <List>
          <List.Item
            thumb={<Icon type={getLocalIcon('/sprite/studentID.svg')} />}
            extra={studentNumber === '' ? '-' : studentNumber}
          >
            学号
          </List.Item>
          {/*<List.Item thumb={<Icon type={getLocalIcon('/sprite/email.svg')} />} extra={email}>邮箱</List.Item>*/}
          <List.Item thumb={<Icon type={getLocalIcon('/sprite/phone.svg')} />}
                     extra={mobilePhone || '未知'}>手机号</List.Item>
          <List.Item thumb={<Icon type={getLocalIcon('/sprite/arrangement.svg')} />} extra={majorLevel}>层次</List.Item>
          {/*<List.Item thumb={<Icon type={getLocalIcon('/sprite/educational.svg')} />} extra={majorLevel}>学制</List.Item>*/}
          <List.Item thumb={<Icon type={getLocalIcon('/sprite/createDate.svg')} />} extra={schoolYear}>招生年度</List.Item>
          <List.Item thumb={<Icon type={getLocalIcon('/sprite/enrollmentdate.svg')} />}
                     extra={schoolTerm}
          >招生季度</List.Item>
          {/*<List.Item thumb={<Icon type={getLocalIcon('/sprite/createUser.svg')} />} extra={createUser}>招生单位</List.Item>*/}
        </List>
      </div>
    </div>
  );
}

export default connect(({ studentStatusGK }) => ({
  studentStatusGK
}))(StudentStatusGK);
