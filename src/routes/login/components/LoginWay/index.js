import React from 'react';
import { Icon } from 'components';
import { Link } from 'dva/router';
import { getLocalIcon } from 'utils';
import styles from './index.less';

const LoginWay = (props) => {
  return (
    <div style={{ width: '100%' }}>
      <div className={styles.title}>
        <span>其他登录方式</span>
      </div>
      <div className={styles.Icon}>
        <Link to={`/login/${props.links}`}>
          <Icon type={getLocalIcon(`/sprite/${props.links === 'accountLogin' ? 'userLogin' : 'phoneLogin'}.svg`)} size="lg" />
        </Link>
        <Icon type={getLocalIcon('/sprite/weChat.svg')} size="lg" />
      </div>
    </div>
  );
};
export default LoginWay;
