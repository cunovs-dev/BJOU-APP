import React from 'react';
import Nav from 'components/nav';
import { connect } from 'dva';
import { Icon } from 'antd-mobile';
import { getImages, getLocalIcon } from 'utils';
import ApplyList from 'components/ApplyList';
import NoContent from 'components/nocontent';
import styles from './index.less';

const Apply = ({ apply, loading, location, dispatch }) => {


  const { list } = apply;
  return (
    <div className={styles.whiteBox}>
      <Nav title="我的申请状态" dispatch={dispatch} />
      <div className={styles.content}>
        {
          list.length > 0 ?
          list.map((item, i) => (
            <ApplyList params={item} key={i} />
          ))
                          :
          <NoContent loading={loading} />
        }
      </div>
    </div>
  );
};


export default connect(({ apply, loading }) => ({
  apply,
  loading
}))(Apply);
