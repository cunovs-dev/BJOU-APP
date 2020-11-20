import React from 'react';
import { Icon, WhiteSpace } from 'components';
import { Link } from 'dva/router';
import { getLocalIcon } from 'utils';
import styles from './index.less';

const LoginWay = (props) => {
  return (
    <div style={{ width: '100%' }}>
      <div className={styles.tips}>
        登录说明：北京开放大学自主学历教育学籍注册学生和国家开放大学（北京分部）学籍注册学生请通过门户登录进入，其他用户请切换到学习平台登录。
      </div>
      <WhiteSpace size="lg" />
      <div className={styles.title}>
        <span>{`${props.links === 'accountLogin' ? '切换门户登录' : '切换学习平台登录'}`}</span>
      </div>
      <div className={styles.Icon}>
        <Link to={`/login/${props.links}`}>
          <Icon
            type={getLocalIcon('/sprite/exchange.svg')}
            size="lg"
            color="#fff"
          />
        </Link>
      </div>
    </div>
  );
};
export default LoginWay;
