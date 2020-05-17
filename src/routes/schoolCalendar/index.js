/**
 * @author Lowkey
 * @date 2020/03/19 14:36:59
 * @Description:
 */
import React from 'react';
import Nav from 'components/nav';
import InnerHtml from 'components/innerhtml';
import { List, WhiteSpace } from 'components';
import { getCommonDate } from 'utils';
import { connect } from 'dva';
import styles from './index.less';

const SchoolCalendar = ({ location, dispatch, schoolCalendar, loading }) => {
  const { data = {} } = schoolCalendar;
  const { title = '', createDate = '', informationSource = '', informationDetail = '', browserNum = 0 } = data;
  const { name } = location.query;
  return (
    <div className={styles.outer}>
      <Nav title={name} dispatch={dispatch} />
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.info}>
          <span>{`来源：${informationSource}`}</span>
          <span>{`发布时间：${getCommonDate(createDate / 1000, false)}`}</span>
          <span>{`点击数：${browserNum}`}</span>
        </div>
      </div>
      <div className={styles.contaniner}>
        <InnerHtml data={informationDetail} />
      </div>
    </div>
  );
};

export default connect(({ loading, schoolCalendar }) => ({
  loading,
  schoolCalendar
}))(SchoolCalendar);
