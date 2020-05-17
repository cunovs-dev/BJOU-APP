import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Button } from 'components';
import styles from './index.less';

const Building = ({ dispatch, location }) => {
  const getContents = () => {
      return {
        __html: cnUpholdMsg,
      };
    },
    handlerExit = () => {
      cnExitApp();
    };
  return (
    <div >
      <img
        style={{ width: '100%', height: '100vh' }}
        src={require('../../themes/images/others/building.png')}
        alt=""
      />
      <div className={styles.content} >
        <div dangerouslySetInnerHTML={getContents()} />
        <WhiteSpace size="lg" />
        <Button style={{ width: '100%' }} type="ghost" size="small" onClick={handlerExit} >退出</Button >
      </div >
    </div >
  );
};
export default connect(({ loading, building }) => ({
  loading,
  building,
}))(Building);
