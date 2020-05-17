import React from 'react';
import { Icon, ActivityIndicator } from 'components';
import { getImages, getErrorImg, getLocalIcon } from 'utils';
import { handlerChangeRouteClick } from 'utils/commonevents';
import styles from './index.less';
import bg from './bj.jpg';


const UserInfo = (props) => {
  const { name, group, info, loading, grade, dispatch } = props;
  const { avatar, email, id } = info;
  return (
    <div className={styles.outer} style={{ backgroundImage: `url(${bg})` }}>
      {
        loading ?
        <ActivityIndicator size="large" />
                :
        <div className={styles.info}>
          <img
            src={getImages(avatar, 'user')}
            alt=""
            onClick={handlerChangeRouteClick.bind(null, 'userpage', { userid: id }, dispatch)}
            onError={(el => getErrorImg(el, 'user'))}
          />
          <div className={styles.content}>
            <div>
              <p className={styles.name}>{name}</p>
              <p className={styles.email}>
                <Icon type={getLocalIcon('/components/email.svg')} color="#fff" />
                <span>{email}</span>
              </p>
            </div>
            {
              grade
              ?
              <div className={styles.grade}>
                <p> 课程总分</p>
                <span> {grade}</span>
              </div>
              :
              null
            }
          </div>
        </div>
      }
      <div className={styles.group}>
        {group}
      </div>
    </div>
  );
};

UserInfo.defaultProps = {
  name: '',
  group: '',
  grade: null
};

export default UserInfo;
