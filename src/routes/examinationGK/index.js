/**
 * @author Lowkey
 * @date 2020/03/19 15:06:24
 * @Description:
 */
import React from 'react';
import Nav from 'components/nav';
import { Radio } from 'antd';
import { connect } from 'dva';
import { WhiteSpace, Button, Icon } from 'components';
import { getLocalIcon } from 'utils';
import MobileTable from 'components/MobileTable';
import CunovsTab from 'components/Tabs';
import NoContent from 'components/nocontent';
import styles from './index.less';

const ExaminationGK = ({ dispatch, location, examinationGK, loading }) => {
  const { list, allList } = examinationGK;
  const { name = '考试成绩' } = location.query;
  const onChange = select => {
    if (select === 1) {
      dispatch({
        type: 'examinationGK/queryList'
      });
    }
  };
  return (
    <div className={styles.outer}>
      <Nav title={name} dispatch={dispatch} />
      <WhiteSpace />
      <CunovsTab defaultIndex={0} onTabClick={onChange}>
        <CunovsTab.TabItem label="本年度成绩" tabIndex={0}>
          {
            cnIsArray(list) && list.length > 0 ?
            <MobileTable data={list} />
                                               :
            <NoContent isLoading={loading} />
          }
        </CunovsTab.TabItem>
        <CunovsTab.TabItem label="往年成绩" tabIndex={1}>
          {
            cnIsArray(allList) && allList.length > 0 ?
            <MobileTable data={allList} />
                                                     :
            <NoContent isLoading={loading} />
          }
        </CunovsTab.TabItem>
      </CunovsTab>

    </div>
  );
};
export default connect(({ loading, examinationGK }) => ({
  loading: loading.effects['examinationGK/queryList'],
  examinationGK
}))(ExaminationGK);
