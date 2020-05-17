import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Button } from 'components';
import Nav from 'components/nav';
import { routerRedux } from 'dva/router';
import styles from './index.less';

const SuccessPage = ({ dispatch }) => {
  const handlerClick = () => {
    dispatch(routerRedux.replace({
      pathname: '/login'
    }));
  };
  return (
    <div className={styles.container}>
      <Nav title="找回密码" dispatch={dispatch} />
      <img
        src={require('../../../themes/images/others/success.png')}
        alt=""
      />
      <WhiteSpace size="lg" />
      <div>找回成功</div>
      <WhiteSpace size="lg" />
      <WhiteSpace size="lg" />
      <WhiteSpace size="lg" />
      <Button style={{ width: '100%' }} type="primary" onClick={handlerClick}>前往首页</Button>
    </div>
  );
};
export default connect(({ loading, building }) => ({
  loading,
  building
}))(SuccessPage);
